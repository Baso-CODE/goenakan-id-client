/**
 * Global Currency Formatter
 *
 * Digunakan oleh:
 * - Best Seller
 * - Product Detail
 * - Related Products
 * - Product Grid
 * - Cart
 * - Checkout
 *
 * Hanya memformat harga.
 * Konversi kurs tetap dilakukan oleh backend.
 */

type CurrencyDisplayMode = "code" | "symbol";

interface FormatCurrencyOptions {
  display?: CurrencyDisplayMode;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

const formatterCache = new Map<string, Intl.NumberFormat>();

const CURRENCY_LOCALES: Record<string, string> = {
  IDR: "id-ID",
  SGD: "en-SG",
  USD: "en-US",
  MYR: "ms-MY",
  CNY: "zh-CN",
  EUR: "de-DE",
  JPY: "ja-JP",
  GBP: "en-GB",
  AUD: "en-AU",
  KRW: "ko-KR",
  THB: "th-TH",
  INR: "en-IN",
};

export function formatCurrency(
  amount: number,
  currencyCode: string = "IDR",
  options: FormatCurrencyOptions = {},
): string {
  const currency = currencyCode?.trim().toUpperCase() || "IDR";

  const {
    display = "code",
    locale = CURRENCY_LOCALES[currency] || "en-US",
    minimumFractionDigits = currency === "IDR" ? 0 : 2,
    maximumFractionDigits = currency === "IDR" ? 0 : 2,
  } = options;

  if (!Number.isFinite(amount)) {
    return "—";
  }

  const cacheKey = [
    locale,
    currency,
    display,
    minimumFractionDigits,
    maximumFractionDigits,
  ].join(":");

  let formatter = formatterCache.get(cacheKey);

  if (!formatter) {
    try {
      formatter = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        currencyDisplay: display,
        minimumFractionDigits,
        maximumFractionDigits,
      });

      formatterCache.set(cacheKey, formatter);
    } catch (error) {
      console.error(
        "[CurrencyFormatter] Invalid currency configuration:",
        error,
      );

      return `${currency} ${amount.toFixed(2)}`;
    }
  }

  const formatted = formatter.format(amount);

  // Khusus Rupiah, pertahankan gaya tampilan Rp.
  if (currency === "IDR") {
    return formatted.replace("IDR", "Rp").trim();
  }

  // Bila memakai simbol, bedakan SGD dari USD.
  if (currency === "SGD" && display === "symbol") {
    return formatted.replace(/^\$/, "S$");
  }

  return formatted;
}
