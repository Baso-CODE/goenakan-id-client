// src/app/types/itemCart/cartItemUI.type.ts

export interface CartItemUI {
  id: string | number;
  productId: string;
  variantId?: string | null;
  name: string;
  price: number;
  quantity: number;
  image: string;

  // Sama dengan payload di atas
  weight?: string;
  dimensions?: string;
  materialType?: string | null;
  rawWeight?: number | null;
  width?: number | null;
  height?: number | null;
  length?: number | null;
}
