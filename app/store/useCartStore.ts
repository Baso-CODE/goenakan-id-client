// src/app/store/useCartStore.ts
import { apiUrl } from "@/app/utils/ApiUrl";
import { getUserCountryFromCookie } from "@/lib/getUserCountryFromCookie";
import { toast } from "sonner";
import { create } from "zustand";
import { pushEcommerceEvent } from "../lib/tracking/dataLayer";
import { cartItemToEcommerceItem } from "../lib/tracking/ecommerce";
import { AddToCartPayload } from "../types/itemCart/addToCartPayload.type";
import { CartItemUI } from "../types/itemCart/cartItemUI.type";

interface CartState {
  cartItems: CartItemUI[];
  loading: boolean;
  currencyCode: string;

  fetchCart: (token?: string) => Promise<void>;

  addToCart: (
    product: AddToCartPayload,
    quantity: number,
    token?: string,
    locale?: string,
  ) => Promise<boolean>;
  hydrateGuestCart: () => void;
  updateQty: (
    id: string | number,
    delta: number,
    token?: string,
  ) => Promise<void>;
  removeItem: (id: string | number, token?: string) => Promise<void>;
  clearCart: (token?: string) => Promise<void>;
}

function trackAddToCart(
  item: CartItemUI | undefined,
  addedQuantity: number,
): void {
  // Kontrak GTM v1.5:
  // Jangan kirim add_to_cart jika currency bukan IDR.
  if (useCartStore.getState().currencyCode !== "IDR") {
    return;
  }

  if (!item || !Number.isSafeInteger(addedQuantity) || addedQuantity <= 0) {
    return;
  }

  const ecommerceItem = cartItemToEcommerceItem(item, addedQuantity);

  if (!ecommerceItem) {
    console.warn("[GTM] add_to_cart dilewati: metadata produk belum lengkap.");
    return;
  }

  pushEcommerceEvent("add_to_cart", [ecommerceItem]);
}

function readGuestCart(): CartItemUI[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem("guest_cart");

  if (!stored) return [];

  try {
    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      console.warn("[Guest Cart] Format keranjang tidak valid.");
      return [];
    }

    return parsed.filter(
      (item): item is CartItemUI =>
        typeof item === "object" &&
        item !== null &&
        typeof item.productId === "string" &&
        typeof item.quantity === "number" &&
        Number.isSafeInteger(item.quantity) &&
        item.quantity > 0,
    );
  } catch (error) {
    console.error("[Guest Cart] Gagal membaca keranjang:", error);
    return [];
  }
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  loading: false,
  currencyCode: "IDR",

  // ==========================================
  // HYDRATE GUEST CART
  // ==========================================
  hydrateGuestCart: () => {
    if (typeof window === "undefined") return;

    const storedCart = readGuestCart();

    set({
      cartItems: storedCart,
    });
  },

  // === 1. FETCH CART (MENGAMBIL HARGA & CURRENCY DARI BACKEND) ===
  fetchCart: async (token) => {
    set({ loading: true });
    const userCountry = getUserCountryFromCookie();

    if (token) {
      // --- LOGIKA USER LOGIN ---
      const localCart = localStorage.getItem("guest_cart");
      if (localCart) {
        try {
          const parsedCart: CartItemUI[] = JSON.parse(localCart);
          const payload = {
            items: parsedCart.map((i) => ({
              productId: i.productId,
              variantId: i.variantId || null,
              quantity: i.quantity,
              customization: i.customization || null,
              selectedAttributes: i.selectedAttributes || null,
            })),
          };
          await fetch(`${apiUrl}/cart/sync`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "x-country": userCountry || "ID",
            },
            body: JSON.stringify(payload),
          });
          localStorage.removeItem("guest_cart");
        } catch (e) {
          console.error("Sync error", e);
        }
      }

      try {
        const res = await fetch(`${apiUrl}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-country": userCountry || "ID",
          },
        });
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.currencyCode)
            set({ currencyCode: json.data.currencyCode });
          if (json.data.items)
            set({ cartItems: formatCartItems(json.data.items) });
        }
      } catch (e) {
        console.error("Fetch DB cart error:", e);
      }
    } else {
      // --- LOGIKA GUEST (Minta Backend yang Menghitung Konversi Dolar) ---
      const localCart = localStorage.getItem("guest_cart");
      if (localCart) {
        try {
          const parsedCart = JSON.parse(localCart);
          // Mengirim isi localStorage ke backend untuk dikalkulasi harganya
          const res = await fetch(`${apiUrl}/cart/guest-calculate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-country": userCountry || "ID",
            },
            body: JSON.stringify({ items: parsedCart }),
          });
          const json = await res.json();

          if (json.success && json.data) {
            // ✅ BERHASIL! Frontend menerima Data Currency dari Backend
            if (json.data.currencyCode)
              set({ currencyCode: json.data.currencyCode });
            if (json.data.items) set({ cartItems: json.data.items });
          }
        } catch (e) {
          console.error("Gagal menghitung keranjang guest di backend:", e);
        }
      } else {
        set({ cartItems: [] });
      }
    }
    set({ loading: false });
  },

  // === 2. ADD TO CART + GTM TRACKING ===
  addToCart: async (
    product,
    quantity,
    token,
    locale = "id",
  ): Promise<boolean> => {
    const userCountry = getUserCountryFromCookie();

    const messages =
      locale === "en"
        ? {
            success: "Item added to cart successfully!",
            failed: "Failed to add item to cart.",
            networkError: "A network error occurred. Please try again.",
          }
        : {
            success: "Barang berhasil ditambahkan ke keranjang!",
            failed: "Gagal menambahkan barang ke keranjang.",
            networkError: "Terjadi kesalahan jaringan. Silakan coba lagi.",
          };

    if (!Number.isSafeInteger(quantity) || quantity <= 0) {
      toast.error(messages.failed);
      return false;
    }

    const variantId = product.variantId ?? null;
    const matchesProduct = (item: CartItemUI) =>
      item.productId === product.id && (item.variantId ?? null) === variantId;

    if (token) {
      try {
        const previousItem = get().cartItems.find(matchesProduct);
        const previousQty = previousItem?.quantity ?? 0;

        const res = await fetch(`${apiUrl}/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-country": userCountry || "ID",
          },
          body: JSON.stringify({
            productId: product.id,
            variantId,
            quantity,
            price: product.price,
            selectedAttributes: product.selectedAttributes || null,
            customization: product.customization || null,
          }),
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
          toast.error(messages.failed);
          return false;
        }

        await get().fetchCart(token);

        const updatedItem = get().cartItems.find(matchesProduct);

        if (updatedItem && updatedItem.quantity >= previousQty + quantity) {
          trackAddToCart(updatedItem, quantity);
        } else {
          console.warn(
            "[GTM] add_to_cart tidak dikirim: hasil cart belum terkonfirmasi.",
          );
        }

        toast.success(messages.success);
        return true;
      } catch (error) {
        console.error("Add to cart error:", error);
        toast.error(messages.networkError);
        return false;
      }
    }

    // === GUEST CART ===
    const previousStorage = localStorage.getItem("guest_cart");

    // GUEST CART - FIX STORAGE HYDRATION
    try {
      // Selalu baca sumber data terbaru dari localStorage.
      // Jangan mengandalkan state Zustand yang mungkin belum di-hydrate.

      const cartItems = readGuestCart();

      const existingItem = cartItems.find(matchesProduct);

      const newCart = existingItem
        ? cartItems.map((item) =>
            item.id === existingItem.id
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                }
              : item,
          )
        : [
            ...cartItems,
            {
              id: Date.now(),
              productId: product.id,
              variantId,
              quantity,
              selectedAttributes: product.selectedAttributes || null,
              customization: product.customization || null,
            },
          ];

      // ==========================================
      // CALCULATE CART
      // ==========================================

      const res = await fetch(`${apiUrl}/cart/guest-calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-country": userCountry || "ID",
        },
        body: JSON.stringify({
          items: newCart,
        }),
      });

      if (!res.ok) {
        throw new Error(`Guest cart calculation failed: ${res.status}`);
      }

      const result = await res.json();

      if (!result.success || !Array.isArray(result.data?.items)) {
        toast.error(messages.failed);
        return false;
      }

      const updatedItems = result.data.items as CartItemUI[];

      const updatedItem = updatedItems.find(matchesProduct);

      const expectedQty = (existingItem?.quantity ?? 0) + quantity;

      if (!updatedItem || updatedItem.quantity < expectedQty) {
        toast.error(messages.failed);
        return false;
      }

      // ==========================================
      // SAVE CART
      // ==========================================

      // Jika tab lain mengubah keranjang ketika request berjalan,
      // jangan menimpa perubahan tersebut dengan snapshot lama.

      const latestCart = readGuestCart();

      if (JSON.stringify(latestCart) !== JSON.stringify(cartItems)) {
        toast.error(
          locale === "en"
            ? "Your cart changed in another tab. Please try again."
            : "Keranjang berubah di tab lain. Silakan coba lagi.",
        );

        await get().fetchCart();
        return false;
      }

      // Jika quota localStorage penuh, setItem akan gagal.
      // State dan tracking tidak boleh diperbarui sebelum penyimpanan sukses.

      localStorage.setItem("guest_cart", JSON.stringify(newCart));

      set({
        cartItems: updatedItems,
        currencyCode: result.data.currencyCode || "IDR",
      });

      // ==========================================
      // GTM TRACKING
      // ==========================================

      // Hanya dikirim setelah keranjang berhasil disimpan.

      trackAddToCart(updatedItem, quantity);

      toast.success(messages.success);

      return true;
    } catch (error) {
      console.error("Guest add to cart error:", error);

      // ==========================================
      // STORAGE QUOTA ERROR
      // ==========================================

      if (
        error instanceof DOMException &&
        (error.name === "QuotaExceededError" || error.code === 22)
      ) {
        toast.error(
          locale === "en"
            ? "Logo or customization data is too large. Please use a smaller image."
            : "Ukuran logo atau data custom terlalu besar. Silakan gunakan gambar yang lebih kecil.",
        );

        return false;
      }

      toast.error(messages.networkError);

      return false;
    }
  },

  // === 3. UPDATE QUANTITY + GTM TRACKING ===
  updateQty: async (id, delta, token) => {
    const userCountry = getUserCountryFromCookie();
    const previousItem = get().cartItems.find((item) => item.id === id);

    if (!previousItem) return;
    if (!Number.isSafeInteger(delta) || delta === 0) return;

    const previousQty = previousItem.quantity;
    const newQty = Math.max(1, previousQty + delta);
    const addedQty = newQty - previousQty;

    if (newQty === previousQty) return;

    if (token) {
      try {
        const res = await fetch(`${apiUrl}/cart/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-country": userCountry || "ID",
          },
          body: JSON.stringify({ quantity: newQty }),
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
          toast.error("Gagal memperbarui jumlah produk.");
          return;
        }

        await get().fetchCart(token);

        const updatedItem = get().cartItems.find((item) => item.id === id);

        if (updatedItem?.quantity === newQty && addedQty > 0) {
          trackAddToCart(updatedItem, addedQty);
        }
      } catch (error) {
        console.error("Update cart quantity error:", error);
        toast.error("Gagal memperbarui jumlah produk.");
      }

      return;
    }

    // === GUEST CART ===
    try {
      const cartItems = get().cartItems;

      const updatedCart = cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item,
      );

      const res = await fetch(`${apiUrl}/cart/guest-calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-country": userCountry || "ID",
        },
        body: JSON.stringify({ items: updatedCart }),
      });

      const result = await res.json();

      if (!res.ok || !result.success || !Array.isArray(result.data?.items)) {
        toast.error("Gagal memperbarui jumlah produk.");
        return;
      }

      const updatedItems = result.data.items as CartItemUI[];
      const updatedItem = updatedItems.find((item) => item.id === id);

      if (!updatedItem || updatedItem.quantity !== newQty) {
        toast.error("Jumlah produk tidak sesuai hasil kalkulasi.");
        return;
      }

      localStorage.setItem("guest_cart", JSON.stringify(updatedCart));

      set({
        cartItems: updatedItems,
        currencyCode: result.data.currencyCode || "IDR",
      });

      if (addedQty > 0) {
        trackAddToCart(updatedItem, addedQty);
      }
    } catch (error) {
      console.error("Guest update quantity error:", error);
      toast.error("Gagal memperbarui jumlah produk.");
    }
  },

  // === 4. REMOVE ITEM ===
  removeItem: async (id, token) => {
    const userCountry = getUserCountryFromCookie();
    if (token) {
      try {
        await fetch(`${apiUrl}/cart/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "x-country": userCountry || "ID",
          },
        });
        await get().fetchCart(token);
        toast.success("Barang dihapus.");
      } catch (e) {
        console.error(e);
      }
    } else {
      const newCart = get().cartItems.filter((i) => i.id !== id);
      localStorage.setItem("guest_cart", JSON.stringify(newCart));
      await get().fetchCart();
      toast.success("Barang dihapus.");
    }
  },

  // === 5. CLEAR CART ===
  clearCart: async (token?: string) => {
    set({ cartItems: [] });
    localStorage.removeItem("guest_cart");
    if (token) {
      try {
        await fetch(`${apiUrl}/cart/all/clear`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        console.error(e);
      }
    }
  },
}));

// Format respons GET /cart untuk kebutuhan UI dan GTM
function formatCartItems(items: any[]): CartItemUI[] {
  return items.map((item: any) => {
    const product = item.product;

    const dimParts = [product?.length, product?.width, product?.height].filter(
      (val) => val != null,
    );

    return {
      // Identitas cart dan produk
      id: item.id,
      productId: item.productId,
      productSku: item.productSku ?? product?.sku ?? null,
      variantId: item.variantId ?? null,

      // Informasi produk
      name: product?.name || item.name || "Unnamed Product",
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      image:
        product?.images?.[0]?.url ||
        item.image ||
        "/images/products/demo-products.png",

      // Metadata GTM / GA4 Ecommerce
      variantSku: item.variantSku ?? item.variant?.sku ?? null,
      itemCategoryEn: item.itemCategoryEn ?? product?.category?.name_en ?? null,
      itemCategoryName:
        item.itemCategoryName ?? product?.itemCategory?.name ?? null,
      trackingPriceIdr:
        item.trackingPriceIdr != null &&
        Number.isFinite(Number(item.trackingPriceIdr))
          ? Number(item.trackingPriceIdr)
          : null,

      // Informasi produk lainnya
      materialType: product?.materialType?.name ?? item.materialType ?? null,
      dimensions:
        dimParts.length > 0 ? `${dimParts.join(" x ")} cm` : item.dimensions,
      weight: product?.weight != null ? `${product.weight} gram` : item.weight,
      rawWeight: product?.weight ?? item.rawWeight ?? null,
      width: product?.width ?? item.width ?? null,
      height: product?.height ?? item.height ?? null,
      length: product?.length ?? item.length ?? null,
      itemNameValue: item.itemNameValue ?? null,

      // Customization
      customization: item.customization ?? null,
      selectedAttributes: item.selectedAttributes ?? null,
    };
  });
}
