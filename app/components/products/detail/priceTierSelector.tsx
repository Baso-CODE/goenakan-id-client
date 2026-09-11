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
  locale?: string;
}

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

function getTierTitle(index: number, total: number, locale: string) {
  if (total === 3) {
    if (locale === "en") {
      return ["Starter Order", "Standard Order", "Premium Order"][index];
    }

    return ["Starter Order", "Standard Order", "Premium Order"][index];
  }

  return `Tier ${index + 1}`;
}

function getTierSubtitle(index: number, total: number, locale: string): string {
  if (total !== 3) return "";

  if (locale === "en") {
    return [
      "Perfect for small batches & test orders",
      "Ideal for growing needs & mid-size orders",
      "Tailored for large-scale & corporate projects",
    ][index];
  }

  return [
    "Cocok untuk pesanan kecil & percobaan",
    "Ideal untuk kebutuhan berkembang & pesanan menengah",
    "Untuk proyek besar & kebutuhan korporat",
  ][index];
}

export function PriceTierSelector({
  tiers,
  selectedIndex,
  onSelect,
  currencyCode = "IDR",
  locale = "id",
}: PriceTierSelectorProps) {
  if (!tiers || tiers.length === 0) return null;

  const premiumIndex = tiers.length - 1;

  return (
    <div className="mt-4">
      <div className="grid grid-cols-3 gap-2 sm:gap-3 items-end">
        {tiers.map((tier, index) => {
          const isSelected = selectedIndex === index;
          const isPremium = index === premiumIndex;

          const min = tier.minQty ?? tier.minQuantity ?? 1;
          const max = tier.maxQty ?? tier.maxQuantity ?? null;

          const rawPrice = tier.pricePerPcs ?? tier.price ?? 0;

          const parsedPrice =
            typeof rawPrice === "string"
              ? Number.parseFloat(rawPrice)
              : rawPrice;

          const price = Number.isFinite(parsedPrice) ? parsedPrice : 0;

          const title = tier.label || getTierTitle(index, tiers.length, locale);

          const subtitle =
            tier.subtitle || getTierSubtitle(index, tiers.length, locale);

          const badge =
            tier.badge ||
            (isPremium
              ? locale === "en"
                ? "Best Value!"
                : "Best Value!"
              : null);

          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(index)}
              className={`
                group relative w-full overflow-hidden rounded-xl
                text-center transition-all duration-200
                ${isSelected ? "ring-2 ring-[#b9957d] ring-offset-1" : ""}
              `}>
              {isPremium && badge ? (
                <div
                  className={`
                    flex h-7.75 items-center justify-center
                    rounded-t-xl
                    bg-[#c29c84]
                    px-2
                    text-[9px] sm:text-[10px]
                    font-semibold
                    text-white
                  `}>
                  {badge}
                </div>
              ) : (
                <div className="h-7.75" />
              )}

              <div
                className={`
                  flex min-h-20.5 flex-col items-center justify-between
                  px-2 pb-2.5 pt-2
                  sm:min-h-22 sm:px-3
                  ${
                    isPremium
                      ? "rounded-b-xl bg-[#ddd4cf]"
                      : "rounded-xl bg-[#f1f1f1]"
                  }
                `}>
                <div className="w-full">
                  <p className="text-[9px] font-semibold leading-[1.1] text-[#202020] sm:text-[10px]">
                    {title}
                  </p>

                  {subtitle && (
                    <p className="mt-px line-clamp-1 text-[5px] leading-tight text-[#535353] sm:text-[6px]">
                      {subtitle}
                    </p>
                  )}
                </div>

                <div
                  className={`
                    mt-2 flex w-full flex-col items-center
                    rounded-[3px]
                    bg-white
                    px-1.5 py-1.5
                    sm:px-2 sm:py-2
                  `}>
                  <p className="whitespace-nowrap text-[11px] font-bold leading-none text-[#202020] sm:text-[13px]">
                    {formatCurrency(price, currencyCode)}
                    <span className="text-[8px] font-medium sm:text-[9px]">
                      /pcs
                    </span>
                  </p>

                  <p className="mt-1 whitespace-nowrap text-[7px] italic leading-none text-[#555] sm:text-[8px]">
                    {max
                      ? `${min.toLocaleString(
                          locale === "en" ? "en-US" : "id-ID",
                        )} - ${max.toLocaleString(
                          locale === "en" ? "en-US" : "id-ID",
                        )} pcs`
                      : `${min.toLocaleString(
                          locale === "en" ? "en-US" : "id-ID",
                        )}+ pcs`}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
