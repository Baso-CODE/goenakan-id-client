export interface ApiCartItem {
  id: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  product: {
    name: string;
    basePrice: string | number;
    images?: { url: string }[];
  };
  variant?: {
    price: string | number;
  } | null;
}
