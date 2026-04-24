export interface ApiCartItem {
  id: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  product: {
    name: string;
    basePrice: string | number;
    images?: { url: string }[];
    materialType?: string | null;
    weight?: number | null;
    width?: number | null;
    height?: number | null;
    length?: number | null;
  };
  variant?: {
    price: string | number;
  } | null;
}
