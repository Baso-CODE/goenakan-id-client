import type { ProductDetail } from "@/app/types/productDetail.type";
import type { EcommerceItem } from "./dataLayer";

export function productToViewItem(
  product: ProductDetail,
): EcommerceItem | null {
  const variant = product.variants?.[0];

  if (!variant?.id || !variant.sku) return null;

  const categoryEn = product.itemCategoryEn?.trim();
  const category2 = product.itemCategoryName?.trim();

  if (!categoryEn || !category2) return null;

  const tiers = variant.priceTiers?.length
    ? variant.priceTiers
    : product.priceTiers;

  const firstTier = [...(tiers ?? [])].sort((a, b) => a.minQty - b.minQty)[0];

  // Harga harus berasal dari IDR, bukan harga tampilan USD.
  const price = firstTier
    ? Number(firstTier.pricePerPcs)
    : (variant.trackingPriceIdr ?? product.trackingBasePriceIdr);

  if (price == null || !Number.isFinite(Number(price)) || Number(price) < 0) {
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
