export type MediaType = "image" | "video";

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
}
export interface ProductVariantDisplay {
  id: string;
  name: string;
  images: MediaItem[];
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
  category: string;
  name: string;
  sold: number;
  media: MediaItem[];
  variants?: ProductVariantDisplay[];
  priceTiers: PriceTier[];
  description: string;
  weight: string;
  dimensions: string;
  accessories: string;
  whatsappNumber: string;
}
