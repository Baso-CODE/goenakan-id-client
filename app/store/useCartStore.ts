// src/app/store/useCartStore.ts
import { apiUrl } from "@/app/utils/ApiUrl";
import { toast } from "sonner";
import { create } from "zustand";
import { AddToCartPayload } from "../types/itemCart/addToCartPayload.type";
import { ApiCartItem } from "../types/itemCart/apiCartItem.type";
import { CartItemUI } from "../types/itemCart/cartItemUI.type";

interface CartState {
  cartItems: CartItemUI[];
  loading: boolean;

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
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  loading: false,

  // === 1. FETCH CART ===
  fetchCart: async (token) => {
    set({ loading: true });

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
            })),
          };

          await fetch(`${apiUrl}/cart/sync`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
          localStorage.removeItem("guest_cart");
        } catch (e) {
          console.error("Sync error", e);
        }
      }

      // Load data DB terbaru
      try {
        const res = await fetch(`${apiUrl}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();

        if (json.success && json.data?.items) {
          const formattedItems: CartItemUI[] = json.data.items.map(
            (item: ApiCartItem) => {
              // ✨ BUAT STRING DIMENSI & BERAT UNTUK UI
              const dimParts = [
                item.product.length,
                item.product.width,
                item.product.height,
              ].filter((val) => val !== null && val !== undefined);
              const dimString =
                dimParts.length > 0 ? `${dimParts.join(" x ")} cm` : undefined;

              return {
                id: item.id,
                productId: item.productId,
                variantId: item.variantId,
                name: item.product.name,
                price: item.variant
                  ? Number(item.variant.price)
                  : Number(item.product.basePrice),
                quantity: item.quantity,
                image:
                  item.product.images?.[0]?.url ||
                  "/images/products/demo-products.png",

                // ✨ MAPPING DATA MENTAH & STRING
                materialType: item.product.materialType,
                dimensions: dimString,
                weight: item.product.weight
                  ? `${item.product.weight} gram`
                  : undefined,
                rawWeight: item.product.weight,
                width: item.product.width,
                height: item.product.height,
                length: item.product.length,
              };
            },
          );

          set({ cartItems: formattedItems });
        }
      } catch (e) {
        console.error("Fetch DB cart error:", e);
      }
    } else {
      // Logic jika Guest: Ambil dari LocalStorage
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

    if (token) {
      try {
        const res = await fetch(`${apiUrl}/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product.id,
            variantId: product.variantId || null,
            quantity: quantity,
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
            ? { ...i, quantity: i.quantity + quantity }
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

            // ✨ SIMPAN SEMUA DATA DARI PAYLOAD
            materialType: product.materialType,
            dimensions: product.dimensions,
            weight: product.weight,
            rawWeight: product.rawWeight,
            width: product.width,
            height: product.height,
            length: product.length,
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
    // ... (Tidak ada perubahan, kodinganmu sudah benar)
    const { cartItems } = get();
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
          },
          body: JSON.stringify({ quantity: newQty }),
        });
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
    // ... (Tidak ada perubahan, kodinganmu sudah benar)
    const { cartItems } = get();
    const newCart = cartItems.filter((i) => i.id !== id);
    set({ cartItems: newCart });

    if (token) {
      try {
        await fetch(`${apiUrl}/cart/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
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
  clearCart: () => {
    // ... (Tidak ada perubahan, kodinganmu sudah benar)
    set({ cartItems: [] });
    localStorage.removeItem("guest_cart");
  },
}));
