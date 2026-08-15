// src/app/store/useCartStore.ts
import { apiUrl } from "@/app/utils/ApiUrl";
import { getUserCountryFromCookie } from "@/lib/getUserCountryFromCookie";
import { toast } from "sonner";
import { create } from "zustand";
import { AddToCartPayload } from "../types/itemCart/addToCartPayload.type";
import { CartItemUI } from "../types/itemCart/cartItemUI.type";

interface CartState {
  cartItems: CartItemUI[];
  loading: boolean;
  currencyCode: string; // Menyimpan mata uang aktif dari backend

  fetchCart: (token?: string) => Promise<void>;
  addToCart: (
    product: AddToCartPayload,
    quantity: number,
    token?: string,
  ) => Promise<void>;
  updateQty: (
    id: string | number,
    delta: number,
    token?: string,
  ) => Promise<void>;
  removeItem: (id: string | number, token?: string) => Promise<void>;
  clearCart: (token?: string) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  loading: false,
  currencyCode: "IDR", // Default awal

  // === 1. FETCH CART ===
  fetchCart: async (token) => {
    set({ loading: true });

    // Ambil kode negara user dari cookie (Contoh: "ID", "US", "NL")
    const userCountry = getUserCountryFromCookie();

    if (token) {
      // Logic jika Login: Sinkronisasi Guest Cart -> DB
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
            })),
          };

          await fetch(`${apiUrl}/cart/sync`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "x-country": userCountry, // Kirim kode negara ke backend
            },
            body: JSON.stringify(payload),
          });
          localStorage.removeItem("guest_cart");
        } catch (e) {
          console.error("Sync error", e);
        }
      }

      // Load data DB terbaru dari backend
      try {
        const res = await fetch(`${apiUrl}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-country": userCountry, // Kirim kode negara ke backend
          },
        });
        const json = await res.json();

        if (json.success && json.data) {
          // ✨ Tangkap mata uang hasil terjemahan backend (misal: "EUR", "USD", "IDR")
          if (json.data.currencyCode) {
            set({ currencyCode: json.data.currencyCode });
          }

          if (json.data.items) {
            const formattedItems: CartItemUI[] = json.data.items.map(
              (item: any) => {
                const dimParts = [
                  item.product.length,
                  item.product.width,
                  item.product.height,
                ].filter((val) => val !== null && val !== undefined);
                const dimString =
                  dimParts.length > 0
                    ? `${dimParts.join(" x ")} cm`
                    : undefined;

                return {
                  id: item.id,
                  productId: item.productId,
                  variantId: item.variantId,
                  // Menggunakan nama produk (sudah di-handle bilingual oleh backend jika diperlukan)
                  name: item.product.name,
                  // Harga sudah dihitung & dikonversi ke mata uang target oleh backend
                  price: item.price,
                  quantity: item.quantity,
                  image:
                    item.product.images?.[0]?.url ||
                    "/images/products/demo-products.png",

                  materialType: item.product.materialType?.name,
                  dimensions: dimString,
                  weight: item.product.weight
                    ? `${item.product.weight} gram`
                    : undefined,
                  rawWeight: item.product.weight,
                  width: item.product.width,
                  height: item.product.height,
                  length: item.product.length,
                  customization: item.customization,
                };
              },
            );

            set({ cartItems: formattedItems });
          }
        }
      } catch (e) {
        console.error("Fetch DB cart error:", e);
      }
    } else {
      // Jika user belum login (Guest)
      const localCart = localStorage.getItem("guest_cart");
      if (localCart) {
        set({ cartItems: JSON.parse(localCart) });
      } else {
        set({ cartItems: [] });
      }
    }
    set({ loading: false });
  },

  // === 2. ADD TO CART ===
  addToCart: async (product, quantity, token) => {
    const { cartItems, fetchCart } = get();
    const userCountry = getUserCountryFromCookie();

    if (token) {
      try {
        const res = await fetch(`${apiUrl}/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-country": userCountry,
          },
          body: JSON.stringify({
            productId: product.id,
            variantId: product.variantId || null,
            quantity: quantity,
            customization: product.customization || null,
          }),
        });

        if (res.ok) {
          await fetchCart(token);
          toast.success("Barang ditambahkan ke keranjang!");
        } else {
          toast.error("Gagal menambahkan barang.");
        }
      } catch (e) {
        console.error(e);
        toast.error("Terjadi kesalahan jaringan.");
      }
    } else {
      const existingItem = cartItems.find(
        (i) => i.productId === product.id && i.variantId === product.variantId,
      );

      let newCart;
      if (existingItem) {
        newCart = cartItems.map((i) =>
          i.id === existingItem.id
            ? {
                ...i,
                quantity: i.quantity + quantity,
                customization: product.customization || i.customization,
              }
            : i,
        );
      } else {
        newCart = [
          ...cartItems,
          {
            id: Date.now(),
            productId: product.id,
            variantId: product.variantId || null,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image || "/images/products/demo-products.png",
            materialType: product.materialType,
            dimensions: product.dimensions,
            weight: product.weight,
            rawWeight: product.rawWeight,
            width: product.width,
            height: product.height,
            length: product.length,
            customization: product.customization || null,
          },
        ];
      }

      set({ cartItems: newCart });
      localStorage.setItem("guest_cart", JSON.stringify(newCart));
      toast.success("Barang ditambahkan ke keranjang!");
    }
  },

  // === 3. UPDATE QUANTITY ===
  updateQty: async (id, delta, token) => {
    const { cartItems, fetchCart } = get();
    const userCountry = getUserCountryFromCookie();
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + delta);

    set({
      cartItems: cartItems.map((i) =>
        i.id === id ? { ...i, quantity: newQty } : i,
      ),
    });

    if (token) {
      try {
        await fetch(`${apiUrl}/cart/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-country": userCountry,
          },
          body: JSON.stringify({ quantity: newQty }),
        });
        // Segarkan data keranjang dari backend untuk memastikan harga tetap sinkron
        await fetchCart(token);
      } catch (e) {
        console.error("Failed to update qty to DB", e);
      }
    } else {
      const updatedCart = get().cartItems;
      localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
    }
  },

  // === 4. REMOVE ITEM ===
  removeItem: async (id, token) => {
    const { cartItems } = get();
    const userCountry = getUserCountryFromCookie();
    const newCart = cartItems.filter((i) => i.id !== id);
    set({ cartItems: newCart });

    if (token) {
      try {
        await fetch(`${apiUrl}/cart/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "x-country": userCountry,
          },
        });
        toast.success("Barang dihapus.");
      } catch (e) {
        console.error("Failed to delete from DB", e);
      }
    } else {
      localStorage.setItem("guest_cart", JSON.stringify(newCart));
      toast.success("Barang dihapus.");
    }
  },

  // === 5. CLEAR CART ===
  clearCart: async (token?: string) => {
    set({ cartItems: [] });
    localStorage.removeItem("guest_cart");

    if (token) {
      try {
        const res = await fetch(`${apiUrl}/cart/all/clear`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Gagal membersihkan keranjang di database");
        }
      } catch (e) {
        console.error("Error saat memanggil API Clear Cart:", e);
      }
    }
  },
}));
