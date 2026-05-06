// src/app/types/itemCart/addToCartPayload.type.ts

export interface AddToCartPayload {
  id: string;
  name: string;
  price: number;
  image: string;
  variantId?: string | null;

  weight?: string;
  dimensions?: string;

  materialType?: string | null;
  rawWeight?: number | null;
  width?: number | null;
  height?: number | null;
  length?: number | null;
}
