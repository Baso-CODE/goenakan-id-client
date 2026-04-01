export interface PriceTier {
  label: string;
  subtitle: string;
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
  images: string[];
  priceTiers: PriceTier[];
  description: string;
  weight: string;
  dimensions: string;
  accessories: string;
  whatsappNumber: string;
}
