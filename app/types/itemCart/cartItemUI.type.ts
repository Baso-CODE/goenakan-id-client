export interface CartItemUI {
  id: string | number;

  // Identitas produk
  productId: string;
  variantId?: string | null;

  // Informasi produk
  name: string;
  price: number;
  quantity: number;
  image: string;

  // ==========================================
  // GTM / GA4 ECOMMERCE METADATA
  // ==========================================

  // SKU varian untuk item_variant
  variantSku?: string | null;

  // Nama kategori dalam bahasa Inggris
  itemCategoryEn?: string | null;

  // Contoh: UMBRELLA
  itemCategoryName?: string | null;

  // Harga satuan IDR berdasarkan tier quantity
  trackingPriceIdr?: number | null;

  // ==========================================
  // INFORMASI PRODUK LAINNYA
  // ==========================================

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
