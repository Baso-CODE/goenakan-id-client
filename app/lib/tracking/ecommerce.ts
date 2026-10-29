import type { CartItemUI } from "@/app/types/itemCart/cartItemUI.type";
import type { EcommerceItem } from "./dataLayer";

export function cartItemToEcommerceItem(
  item: CartItemUI,
  quantity: number = item.quantity,
): EcommerceItem | null {
  const variantId = item.variantId?.trim();
  const hasVariant = Boolean(variantId);

  const itemId = hasVariant ? variantId : item.productId?.trim();
  const itemSku = hasVariant
    ? item.variantSku?.trim()
    : item.productSku?.trim();

  const categoryEn = item.itemCategoryEn?.trim();
  const category2 = item.itemCategoryName?.trim();

  // Tracking wajib menggunakan harga IDR dari backend.
  const rawPrice = item.trackingPriceIdr;
  const price = rawPrice == null ? NaN : Number(rawPrice);

  if (
    !itemId ||
    !itemSku ||
    !categoryEn ||
    !category2 ||
    !item.productId ||
    !item.name ||
    !Number.isFinite(price) ||
    price < 0 ||
    !Number.isSafeInteger(quantity) ||
    quantity <= 0
  ) {
    return null;
  }

  return {
    item_id: itemId,
    item_group_id: item.productId,
    item_variant: itemSku,
    item_name: item.name,
    item_category: categoryEn,
    item_category2: category2,
    price,
    quantity,
  };
}

export function cartToEcommerceItems(
  cartItems: CartItemUI[],
): EcommerceItem[] | null {
  if (!cartItems.length) return null;

  const validItems = cartItems.flatMap((item) => {
    const ecommerceItem = cartItemToEcommerceItem(item);

    if (!ecommerceItem) {
      console.warn("[GTM] Checkout: item tidak valid dilewati.", {
        cartItemId: item.id,
        productId: item.productId,
      });
      return [];
    }

    return [ecommerceItem];
  });

  if (!validItems.length) {
    console.warn("[GTM] Checkout: tidak ada item valid.");
    return null;
  }

  return validItems;
}
