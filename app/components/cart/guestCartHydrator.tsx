"use client";

import { useCartStore } from "@/app/store/useCartStore";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function GuestCartHydrator() {
  const { status } = useSession();

  useEffect(() => {
    if (status !== "unauthenticated") return;

    const store = useCartStore.getState();

    // Tampilkan isi guest cart segera.
    store.hydrateGuestCart();

    // Refresh informasi produk dan harga dari backend.
    // Tidak mengirim event add_to_cart.
    void store.fetchCart();
  }, [status]);

  return null;
}
