export interface AddToCartPayload {
  id: string;
  name: string;
  price: number;
  image: string;
  variantId?: string | null;
}
