"use client";

interface FlexiblePriceTier {
  label?: string;
  subtitle?: string;
  badge?: string | null;

  pricePerPcs?: number;
  minQty?: number;
  maxQty?: number | null;

  price?: number | string;
  minQuantity?: number;
  maxQuantity?: number | null;
}

interface PriceTierSelectorProps {
  tiers: FlexiblePriceTier[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  currencyCode?: string;
}

// ✨ Fungsi Format Mata Uang Dinamis (Mendukung IDR, USD, EUR, JPY, dll)
function formatCurrency(amount: number, currencyCode: string = "IDR"): string {
  let locale = "id-ID";
  if (currencyCode === "USD") locale = "en-US";
  else if (currencyCode === "EUR") locale = "de-DE";
  else if (currencyCode === "JPY") locale = "ja-JP";
  else if (currencyCode === "MYR") locale = "ms-MY";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: currencyCode === "IDR" ? 0 : 2,
    maximumFractionDigits: currencyCode === "IDR" ? 0 : 2,
  }).format(amount);
}

export function PriceTierSelector({
  tiers,
  selectedIndex,
  onSelect,
  currencyCode = "IDR", // ✨ Default ke IDR jika kosong
}: PriceTierSelectorProps) {
  const BADGE_H = "h-7";

  if (!tiers || tiers.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-2 items-end mt-4">
      {tiers.map((tier, index) => {
        const isSelected = selectedIndex === index;

        const min = tier.minQty ?? tier.minQuantity ?? 1;
        const max = tier.maxQty ?? tier.maxQuantity ?? null;

        const rawPrice = tier.pricePerPcs ?? tier.price ?? 0;
        const price =
          typeof rawPrice === "string" ? parseFloat(rawPrice) : rawPrice;

        const label = tier.label || `Tier ${index + 1}`;
        const badge =
          tier.badge || (index === tiers.length - 1 ? "Termurah" : null);

        return (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`relative flex flex-col w-full text-center rounded-sm border transition-all duration-150 overflow-visible mt-6 ${
              isSelected
                ? "border-stone-800 ring-1 ring-stone-800 bg-stone-50/50"
                : "border-stone-200 hover:border-stone-400 bg-white"
            }`}>
            {/* Badge area */}
            {badge && (
              <span
                className={`absolute left-0 right-0 -top-7 ${BADGE_H} flex items-center justify-center bg-[#b5956a] text-white text-xs sm:text-sm font-bold rounded-t-sm shadow-sm ${
                  isSelected ? "ring-1 ring-stone-800 ring-b-0" : ""
                }`}>
                {badge}
              </span>
            )}

            {/* Card Body */}
            <div className="flex flex-col items-center px-2 sm:px-3 pt-3 pb-4 rounded-sm w-full h-full justify-between">
              <div>
                <p className="font-semibold text-stone-800 text-xs sm:text-sm leading-tight">
                  {label}
                </p>
                {tier.subtitle && (
                  <p className="text-stone-500 text-[10px] sm:text-[11px] mt-0.5 leading-tight">
                    {tier.subtitle}
                  </p>
                )}
              </div>

              <div className="mt-3">
                <p className="font-bold text-stone-900 text-sm sm:text-base leading-none">
                  {formatCurrency(price, currencyCode)}{" "}
                  {/* ✨ Menggunakan format dinamis */}
                </p>
                <p className="text-stone-700 text-[10px] sm:text-[11px] mt-1 font-medium">
                  {min.toLocaleString("id-ID")}
                  {max ? ` - ${max.toLocaleString("id-ID")} pcs` : `+ pcs`}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
