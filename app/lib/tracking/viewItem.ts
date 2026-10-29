import type { ProductDetail } from "@/app/types/productDetail.type";
import type { EcommerceItem } from "./dataLayer";

export function productToViewItem(
  product: ProductDetail,
): EcommerceItem | null {
  const variant = product.variants?.[0];

  const itemId = variant?.id?.trim() || product.id?.trim();
  const itemSku = variant?.sku?.trim() || product.sku?.trim();
  const categoryEn = product.itemCategoryEn?.trim();
  const category2 = product.itemCategoryName?.trim();

  const rawPrice = variant?.trackingPriceIdr ?? product.trackingBasePriceIdr;
  const price = rawPrice == null ? NaN : Number(rawPrice);

  if (!itemId || !itemSku || !product.id || !product.name) {
    console.warn("[GTM] view_item: identitas produk tidak lengkap.");
    return null;
  }

  if (!categoryEn || !category2) {
    console.warn("[GTM] view_item: kategori belum lengkap.");
    return null;
  }

  if (!Number.isFinite(price) || price < 0) {
    console.warn("[GTM] view_item: harga IDR belum valid.");
    return null;
  }

  return {
    item_id: itemId,
    item_group_id: product.id,
    item_variant: itemSku,
    item_name: product.name,
    item_category: categoryEn,
    item_category2: category2,
    price,
    quantity: 1,
  };
}
