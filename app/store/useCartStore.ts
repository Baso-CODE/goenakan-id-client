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

  // Actions
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

  // === 1. FETCH CART (Membaca dari DB atau LocalStorage) ===
  fetchCart: async (token) => {
    set({ loading: true });

    if (token) {
      // Logic jika Login: Sinkronisasi Guest Cart -> DB
      const localCart = localStorage.getItem("guest_cart");
      if (localCart) {
        try {
          const parsedCart: CartItemUI[] = JSON.parse(localCart);
          // Format payload sesuai DTO sync di backend kamu
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
            (item: ApiCartItem) => ({
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
            }),
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
        set({ cartItems: [] }); // Pastikan kosong jika tidak ada data
      }
    }
    set({ loading: false });
  },

  // === 2. ADD TO CART ===
  addToCart: async (product, quantity, token) => {
    const { cartItems, fetchCart } = get();

    if (token) {
      // JIKA LOGIN: Tembak API Add To Cart
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
          // Refresh data dari DB agar mendapat ID keranjang yang asli
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
      // JIKA GUEST: Update LocalStorage
      const existingItem = cartItems.find(
        (i) => i.productId === product.id && i.variantId === product.variantId,
      );

      let newCart;
      if (existingItem) {
        // Jika barang sudah ada, tambah quantity saja
        newCart = cartItems.map((i) =>
          i.id === existingItem.id
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      } else {
        // Jika barang baru, buat data baru dengan ID sementara (Timestamp)
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
    const { cartItems } = get();
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + delta);

    // Optimistic UI Update (UI berubah instan)
    set({
      cartItems: cartItems.map((i) =>
        i.id === id ? { ...i, quantity: newQty } : i,
      ),
    });

    if (token) {
      // Tembak API Update secara background
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
      // Update LocalStorage
      const updatedCart = get().cartItems;
      localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
    }
  },

  // === 4. REMOVE ITEM ===
  removeItem: async (id, token) => {
    const { cartItems } = get();

    // Filter item yang akan dihapus
    const newCart = cartItems.filter((i) => i.id !== id);

    // Optimistic UI Update
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

  // === 5. CLEAR CART (Bisa dipanggil saat Logout atau pasca-Checkout) ===
  clearCart: () => {
    set({ cartItems: [] });
    localStorage.removeItem("guest_cart");
  },
}));
