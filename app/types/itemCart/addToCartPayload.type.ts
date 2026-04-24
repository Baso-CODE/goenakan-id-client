// src/app/types/itemCart/addToCartPayload.type.ts

export interface AddToCartPayload {
  id: string;
  name: string;
  price: number;
  image: string;
  variantId?: string | null;

  // ── DATA TEKS (Untuk langsung tampil di UI Cart Guest) ──
  weight?: string;
  dimensions?: string;

  // ── DATA MENTAH (Untuk dikirim ke API/Backend/Ongkir) ──
  materialType?: string | null;
  rawWeight?: number | null;
  width?: number | null;
  height?: number | null;
  length?: number | null;
}
