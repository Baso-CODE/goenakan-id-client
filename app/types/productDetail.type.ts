// src/app/types/productDetail.type.ts (Sesuaikan path-nya)

export type MediaType = "image" | "video";

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
}

export interface AttributeDisplay {
  name: string;
  value: string;
}

export interface ProductVariantDisplay {
  id: string;
  name: string;
  sku: string;
  price: number | null;
  images: MediaItem[];
  attributes: AttributeDisplay[];

  // Angka mentah untuk Payload Cart
  rawWeight: number | null;
  width: number | null;
  height: number | null;
  length: number | null;

  // String siap pakai untuk UI
  weightString: string;
  dimensionsString: string;
}

export interface PriceTier {
  label: string;
  subtitle?: string;
  pricePerPcs: number;
  minQty: number;
  maxQty: number | null;
  badge?: string;
}

export interface ProductDetail {
  id: string;
  sku: string; // Tambahan SKU Induk
  category: string;
  name: string;
  sold: number;
  media: MediaItem[];
  variants?: ProductVariantDisplay[];
  priceTiers: PriceTier[];
  description: string;

  weight: string;
  dimensions: string;
  accessories: string[];
  whatsappNumber: string;

  materialType?: string | null;
  rawWeight?: number | null;
  width?: number | null;
  height?: number | null;
  length?: number | null;
}
