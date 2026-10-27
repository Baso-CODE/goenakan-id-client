export interface CartItemUI {
  id: string | number;

  productId: string;
  variantId?: string | null;

  name: string;
  price: number;
  quantity: number;
  image: string;

  // Metadata ecommerce GA4/GTM
  variantSku?: string | null;
  itemCategoryEn?: string | null;
  itemCategoryName?: string | null;

  weight?: string;
  dimensions?: string;

  materialType?: string | null;
  itemNameValue?: string | null;

  rawWeight?: number | null;
  width?: number | null;
  height?: number | null;
  length?: number | null;

  customization?: unknown;
  selectedAttributes?: unknown;
}
