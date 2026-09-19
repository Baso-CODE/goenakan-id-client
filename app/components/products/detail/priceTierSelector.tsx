"use client";

interface FlexiblePriceTier {
  title?: string;
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

/* =========================================================
   FORMAT CURRENCY
   ========================================================= */

function formatCurrency(amount: number, currencyCode: string = "IDR"): string {
  let numberLocale = "id-ID";

  if (currencyCode === "USD") {
    numberLocale = "en-US";
  } else if (currencyCode === "EUR") {
    numberLocale = "de-DE";
  } else if (currencyCode === "JPY") {
    numberLocale = "ja-JP";
  } else if (currencyCode === "MYR") {
    numberLocale = "ms-MY";
  }

  return new Intl.NumberFormat(numberLocale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: currencyCode === "IDR" ? 0 : 2,
    maximumFractionDigits: currencyCode === "IDR" ? 0 : 2,
  }).format(amount);
}

/* =========================================================
   TIER TITLE
   ========================================================= */

function getTierTitle(index: number, total: number): string {
  if (total === 1) return "Premium Order";
  if (total === 2) return index === 0 ? "Starter Order" : "Premium Order";
  if (total === 3) {
    const titles = ["Starter Order", "Standard Order", "Premium Order"];
    return titles[index];
  }

  if (index === 0) return "Starter Order";
  if (index === total - 1) return "Premium Order";
  if (index === 1) return "Standard Order";
  return `Tier ${index + 1}`;
}

/* =========================================================
   TIER SUBTITLE
   ========================================================= */

function getTierSubtitle(index: number, total: number, locale: string): string {
  const enSubs = {
    starter: "Perfect for small batches & trial orders",
    standard: "Ideal for growing needs & mid-scale orders",
    premium: "Tailored for large-scale & corporate projects",
  };

  const idSubs = {
    starter: "Cocok untuk pesanan kecil & percobaan",
    standard: "Ideal untuk kebutuhan berkembang & pesanan menengah",
    premium: "Untuk proyek besar & kebutuhan korporat",
  };

  const subs = locale === "en" ? enSubs : idSubs;

  if (total === 1) return subs.premium;
  if (total === 2) return index === 0 ? subs.starter : subs.premium;
  if (index === 0) return subs.starter;
  if (index === total - 1) return subs.premium;
  return subs.standard;
}

/* =========================================================
   FORMAT QUANTITY
   ========================================================= */

function formatQuantity(value: number, locale: string): string {
  return value.toLocaleString(locale === "en" ? "en-US" : "id-ID");
}

/* =========================================================
   COMPONENT
   ========================================================= */

export function PriceTierSelector({
  tiers,
  selectedIndex,
  onSelect,
  currencyCode = "IDR",
  locale = "en",
}: PriceTierSelectorProps) {
  if (!tiers?.length) {
    return null;
  }

  const premiumIndex = tiers.length - 1;

  const gridColsClass =
    tiers.length === 1
      ? "grid-cols-1 max-w-[315px]"
      : tiers.length === 2
        ? "grid-cols-1 sm:grid-cols-2 max-w-[650px]"
        : "grid-cols-1 lg:grid-cols-3";

  return (
    <div className="mt-5 w-full">
      <div
        className={`
          mx-auto
          grid
          w-full
          ${gridColsClass}
          items-end
          gap-5
        `}>
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

          const title = tier.title || getTierTitle(index, tiers.length);
          const subtitle =
            tier.subtitle || getTierSubtitle(index, tiers.length, locale);

          const badge =
            tier.badge !== undefined
              ? tier.badge
              : isPremium
                ? "Best Value!"
                : null;

          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(index)}
              aria-pressed={isSelected}
              className={`
                group
                relative
                w-full
                cursor-pointer
                border-0
                bg-transparent
                p-0
                text-center
                outline-none
                rounded-4xl
                transition-all
                duration-300
                ease-in-out
                ${
                  isSelected
                    ? "scale-[1.03] shadow-xl ring-2 ring-[#BE9B84] ring-offset-4 z-10" // Efek saat dipilih (Active)
                    : "hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#BE9B84] focus-visible:ring-offset-2 z-0" // Efek saat kursor diarahkan (Hover)
                }
              `}>
              {/* =========================================
                  PREMIUM HEADER
                  ========================================= */}
              {badge && (
                <div
                  className="
                    flex
                    h-11
                    w-full
                    items-center
                    justify-center
                    rounded-t-4xl
                    bg-[linear-gradient(180deg,#C7A18D_0%,#B18E7B_100%)]
                    px-5
                    text-[21px]
                    font-semibold
                    leading-none
                    text-white
                  ">
                  {badge}
                </div>
              )}

              {/* =========================================
                  CARD BODY
                  ========================================= */}
              <div
                className={`
                  flex
                  h-51
                  w-full
                  flex-col
                  px-5
                  pb-6
                  pt-6.75
                  ${
                    isPremium
                      ? "rounded-b-4xl bg-[#E2DAD7]"
                      : "rounded-4xl bg-[#EEEEEE]"
                  }
                `}>
                {/* =======================================
                    TITLE + SUBTITLE
                    ======================================= */}
                <div className="shrink-0">
                  <h3
                    className="
                      m-0
                      text-[20px]
                      font-bold
                      leading-[1.05]
                      tracking-[-0.02em]
                      text-[#080808]
                    ">
                    {title}
                  </h3>

                  {subtitle && (
                    <p
                      className="
                        mt-0.75
                        text-[12.5px]
                        font-normal
                        leading-[1.2]
                        tracking-[-0.01em]
                        text-[#333333]
                      ">
                      {subtitle}
                    </p>
                  )}
                </div>

                {/* =======================================
                    PRICE BOX
                    ======================================= */}
                <div
                  className={`
                    mt-auto
                    flex
                    h-20
                    w-full
                    shrink-0
                    flex-col
                    items-center
                    justify-center
                    rounded-[10px]
                    bg-white
                    px-2
                    transition-colors
                    duration-300
                    ${isSelected ? "border border-[#BE9B84]/30" : ""}
                  `}>
                  {/* PRICE */}
                  <div
                    className="
                      flex
                      items-baseline
                      justify-center
                      whitespace-nowrap
                      text-[#171717]
                    ">
                    <span
                      className="
                        text-[18px]
                        font-extrabold
                        leading-none
                        tracking-[-0.035em]
                      ">
                      {formatCurrency(price, currencyCode)}
                    </span>
                    <span
                      className="
                        ml-0.75
                        text-[18px]
                        font-bold
                        leading-none
                        tracking-tight
                      ">
                      /pcs
                    </span>
                  </div>

                  {/* QUANTITY */}
                  <p
                    className="
                      mt-2.25
                      text-[15px]
                      font-normal
                      leading-none
                      tracking-[-0.01em]
                      text-[#3F3F3F]
                    ">
                    {max
                      ? `${formatQuantity(min, locale)} - ${formatQuantity(
                          max,
                          locale,
                        )} pcs`
                      : `${formatQuantity(min, locale)}+ pcs`}
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
