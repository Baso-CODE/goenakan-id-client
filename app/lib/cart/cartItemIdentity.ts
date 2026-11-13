type CartIdentityInput = {
  productId: string;
  variantId?: string | null;
  customization?: unknown;
  selectedAttributes?: unknown;
  notes?: string | null;
};

/**
 * Normalisasi data untuk membandingkan konfigurasi Cart.
 *
 * Urutan key object tidak memengaruhi hasil.
 * Urutan array tetap dipertahankan.
 *
 * Ini bukan ID database atau hash keamanan.
 */
function normalizeValue(value: unknown): unknown {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);

      if (parsed !== value) {
        return normalizeValue(parsed);
      }
    } catch {
      // String biasa, misalnya URL logo.
    }

    return value;
  }

  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, entry]) => entry !== undefined)
        .sort(([keyA], [keyB]) => (keyA < keyB ? -1 : keyA > keyB ? 1 : 0))
        .map(([key, entry]) => [key, normalizeValue(entry)]),
    );
  }

  return value;
}

export function getCartItemIdentity(item: CartIdentityInput): string {
  return JSON.stringify({
    productId: item.productId,
    variantId: item.variantId ?? null,
    customization: normalizeValue(item.customization),
    selectedAttributes: normalizeValue(item.selectedAttributes),
    notes: item.notes ?? null,
  });
}

export function isSameCartConfiguration(
  first: CartIdentityInput,
  second: CartIdentityInput,
): boolean {
  return getCartItemIdentity(first) === getCartItemIdentity(second);
}
