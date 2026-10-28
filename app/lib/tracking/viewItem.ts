import type { ProductDetail } from "@/app/types/productDetail.type";
import type { EcommerceItem } from "./dataLayer";

export function productToViewItem(
  product: ProductDetail,
): EcommerceItem | null {
  const variant = product.variants?.[0];
  const categoryEn = product.itemCategoryEn?.trim();
  const category2 = product.itemCategoryName?.trim();

  const price = variant?.trackingPriceIdr ?? product.trackingBasePriceIdr;

  if (!variant?.id || !variant.sku) {
    console.warn("[GTM] view_item: UUID atau SKU varian tidak tersedia.");
    return null;
  }

  if (!categoryEn || !category2) {
    console.warn("[GTM] view_item: metadata kategori belum lengkap.");
    return null;
  }

  if (price == null || !Number.isFinite(Number(price)) || Number(price) < 0) {
    console.warn("[GTM] view_item: harga IDR tidak valid.");
    return null;
  }

  return {
    item_id: variant.id,
    item_group_id: product.id,
    item_variant: variant.sku,
    item_name: product.name,
    item_category: categoryEn,
    item_category2: category2,
    price: Number(price),
    quantity: 1,
  };
}
