export interface EcommerceItem {
  item_id: string;
  item_group_id: string;
  item_variant: string;
  item_name: string;
  item_category: string;
  item_category2: string;
  price: number;
  quantity: number;
}

type EcommerceEventName = "view_item" | "add_to_cart" | "begin_checkout";

interface EcommerceEvent {
  event: EcommerceEventName;
  ecommerce: {
    currency: "IDR";
    value: number;
    items: EcommerceItem[];
  };
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function pushDataLayer(event: Record<string, unknown>): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

export function pushEcommerceEvent(
  eventName: EcommerceEventName,
  items: EcommerceItem[],
): boolean {
  if (typeof window === "undefined") return false;
  if (!items.length) return false;

  const isValid = items.every(
    (item) =>
      Boolean(
        item.item_id &&
        item.item_group_id &&
        item.item_variant &&
        item.item_name &&
        item.item_category &&
        item.item_category2,
      ) &&
      Number.isFinite(item.price) &&
      item.price >= 0 &&
      Number.isSafeInteger(item.quantity) &&
      item.quantity > 0,
  );

  if (!isValid) {
    console.warn(
      `[dataLayer] ${eventName} tidak dikirim: data item belum valid.`,
    );
    return false;
  }

  const value = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const payload: EcommerceEvent = {
    event: eventName,
    ecommerce: {
      currency: "IDR",
      value,
      items,
    },
  };

  window.dataLayer = window.dataLayer || [];

  // Wajib mengosongkan ecommerce sebelum event baru.
  window.dataLayer.push({ ecommerce: null });

  window.dataLayer.push(payload as unknown as Record<string, unknown>);

  return true;
}
