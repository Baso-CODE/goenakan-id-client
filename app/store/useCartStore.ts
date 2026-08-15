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
  currencyCode: string;

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
  currencyCode: "IDR", // Default sementara, akan langsung ditimpa oleh respons backend

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

  // === 2. ADD TO CART ===`
  addToCart: async (product, quantity, token) => {
    const userCountry = getUserCountryFromCookie();

    if (token) {
      // --- JIKA USER LOGIN (Simpan ke Database) ---
      try {
        const res = await fetch(`${apiUrl}/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-country": userCountry || "ID", // 👈 Wajib ada agar backend tahu mata uangnya
          },
          body: JSON.stringify({
            productId: product.id,
            variantId: product.variantId || null,
            quantity: quantity,
            customization: product.customization || null,
          }),
        });
        if (res.ok) {
          await get().fetchCart(token);
          toast.success("Barang ditambahkan ke keranjang!");
        } else {
          toast.error("Gagal menambahkan barang.");
        }
      } catch (e) {
        toast.error("Terjadi kesalahan jaringan.");
      }
    } else {
      // --- JIKA USER GUEST (Simpan ke localStorage & Hitung Kurs via Backend) ---
      const { cartItems } = get();
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
            quantity: quantity,
            customization: product.customization || null,
          },
        ];
      }
      localStorage.setItem("guest_cart", JSON.stringify(newCart));

      // ✨ PANGGIL FETCH DENGAN MENGIRIM COOKIE NEGARA AGAR HARGA TER-REFRESH JADI DOLAR/EURO ✨
      try {
        const res = await fetch(`${apiUrl}/cart/guest-calculate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-country": userCountry || "ID", // 👈 Mengirim header negara agar backend konversi harga
          },
          body: JSON.stringify({ items: newCart }),
        });
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.currencyCode)
            set({ currencyCode: json.data.currencyCode });
          if (json.data.items) set({ cartItems: json.data.items });
        }
      } catch (e) {
        console.error("Gagal kalkulasi guest cart:", e);
      }

      toast.success("Barang ditambahkan ke keranjang!");
    }
  },

  // === 3. UPDATE QUANTITY ===
  updateQty: async (id, delta, token) => {
    const userCountry = getUserCountryFromCookie();
    if (token) {
      const item = get().cartItems.find((i) => i.id === id);
      if (!item) return;
      const newQty = Math.max(1, item.quantity + delta);
      try {
        await fetch(`${apiUrl}/cart/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-country": userCountry || "ID",
          },
          body: JSON.stringify({ quantity: newQty }),
        });
        await get().fetchCart(token);
      } catch (e) {
        console.error(e);
      }
    } else {
      const { cartItems } = get();
      const newCart = cartItems.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i,
      );
      localStorage.setItem("guest_cart", JSON.stringify(newCart));
      await get().fetchCart(); // Hitung ulang harga di backend
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

// Fungsi bantuan kecil untuk formatting
function formatCartItems(items: any[]): CartItemUI[] {
  return items.map((item: any) => {
    const dimParts = [
      item.product.length,
      item.product.width,
      item.product.height,
    ].filter((val) => val != null);
    return {
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      image:
        item.product.images?.[0]?.url || "/images/products/demo-products.png",
      materialType: item.product.materialType?.name,
      dimensions:
        dimParts.length > 0 ? `${dimParts.join(" x ")} cm` : undefined,
      weight: item.product.weight ? `${item.product.weight} gram` : undefined,
      rawWeight: item.product.weight,
      width: item.product.width,
      height: item.product.height,
      length: item.product.length,
      customization: item.customization,
    };
  });
}
