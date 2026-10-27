import type { CartItemUI } from "@/app/types/itemCart/cartItemUI.type";
import type { EcommerceItem } from "./dataLayer";

export function cartItemToEcommerceItem(
  item: CartItemUI,
  quantity: number = item.quantity,
): EcommerceItem | null {
  const variantId = item.variantId?.trim();
  const variantSku = item.variantSku?.trim();
  const categoryEn = item.itemCategoryEn?.trim();
  const category2 = item.itemCategoryName?.trim();

  const price = Number(item.price);

  if (
    !variantId ||
    !variantSku ||
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
    item_id: variantId,
    item_group_id: item.productId,
    item_variant: variantSku,
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

  const items = cartItems.map((item) => cartItemToEcommerceItem(item));

  // Jangan mengirim event parsial jika ada metadata hilang.
  if (items.some((item) => item === null)) {
    console.warn("[dataLayer] Metadata ecommerce keranjang belum lengkap.");
    return null;
  }

  return items as EcommerceItem[];
}
