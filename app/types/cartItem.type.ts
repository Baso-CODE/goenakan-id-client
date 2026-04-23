export interface CartItem {
  id: string | number;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  dimensions?: string;
  weight?: string;
  color?: string;
  material?: string;
}
