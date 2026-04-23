// === 1. INTERFACE KHUSUS FRONTEND ===
export interface CartItemUI {
  id: string | number;
  productId: string;
  variantId?: string | null;
  name: string;
  price: number;
  quantity: number;
  image: string;
  dimensions?: string;
  weight?: string;
  color?: string;
  material?: string;
}
