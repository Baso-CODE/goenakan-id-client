import type { ProductDetail } from "@/app/types/productDetail.type";
import type { EcommerceItem } from "./dataLayer";

// ==========================================
// HELPER: RESOLVE VIEW ITEM PRICE (IDR)
// ==========================================

function resolveViewItemPrice(product: ProductDetail): number | null {
  const variant = product.variants?.[0];

  // Harga tracking wajib berasal dari backend.
  // Jangan menggunakan harga yang sudah dikonversi.
  const rawPrice = variant?.trackingPriceIdr ?? product.trackingBasePriceIdr;

  if (rawPrice === null || rawPrice === undefined) {
    return null;
  }

  const price = Number(rawPrice);

  // Harga 0 tetap valid untuk produk gratis.
  if (!Number.isFinite(price) || price < 0) {
    return null;
  }

  return price;
}

// ==========================================
// BUILD VIEW ITEM - GTM / GA4
// ==========================================

export function productToViewItem(
  product: ProductDetail,
): EcommerceItem | null {
  const variant = product.variants?.[0];

  const itemId = variant?.id?.trim() || product.id?.trim();

  const itemSku = variant?.sku?.trim() || product.sku?.trim();

  const categoryEn = product.itemCategoryEn?.trim();

  const category2 = product.itemCategoryName?.trim();

  const price = resolveViewItemPrice(product);

  // ==========================================
  // 1. VALIDATE PRODUCT IDENTITY
  // ==========================================

  if (!itemId || !itemSku || !product.id || !product.name) {
    console.warn("[GTM] view_item: identitas produk tidak lengkap.");

    return null;
  }

  // ==========================================
  // 2. VALIDATE CATEGORY
  // ==========================================

  if (!categoryEn || !category2) {
    console.warn("[GTM] view_item: kategori belum lengkap.");

    return null;
  }

  // ==========================================
  // 3. VALIDATE TRACKING PRICE
  // ==========================================

  if (price === null) {
    console.warn("[GTM] view_item: harga IDR belum valid.", {
      productId: product.id,
      variantId: variant?.id ?? null,
    });

    return null;
  }

  // ==========================================
  // 4. RETURN GA4 ECOMMERCE ITEM
  // ==========================================

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
