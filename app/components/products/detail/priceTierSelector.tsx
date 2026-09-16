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
  let numberLocale = "id-ID";

  if (currencyCode === "USD") numberLocale = "en-US";
  else if (currencyCode === "EUR") numberLocale = "de-DE";
  else if (currencyCode === "JPY") numberLocale = "ja-JP";
  else if (currencyCode === "MYR") numberLocale = "ms-MY";

  return new Intl.NumberFormat(numberLocale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: currencyCode === "IDR" ? 0 : 2,
    maximumFractionDigits: currencyCode === "IDR" ? 0 : 2,
  }).format(amount);
}

function getTierTitle(index: number, total: number) {
  if (total === 1) {
    return "Premium Order";
  }

  if (total === 2) {
    return index === 0 ? "Starter Order" : "Premium Order";
  }

  const titles = ["Starter Order", "Standard Order", "Premium Order"];

  return titles[index] || `Tier ${index + 1}`;
}

function getTierSubtitle(index: number, total: number, locale: string): string {
  const enSubs = [
    "Perfect for small batches & trial orders",
    "Ideal for growing needs & mid-scale orders",
    "Tailored for large-scale & corporate projects",
  ];

  const idSubs = [
    "Cocok untuk pesanan kecil & percobaan",
    "Ideal untuk kebutuhan berkembang & pesanan menengah",
    "Untuk proyek besar & kebutuhan korporat",
  ];

  const subs = locale === "en" ? enSubs : idSubs;

  if (total === 1) {
    return subs[2];
  }

  if (total === 2) {
    return index === 0 ? subs[0] : subs[2];
  }

  return subs[index] || "";
}

function formatQuantity(value: number, locale: string) {
  return value.toLocaleString(locale === "en" ? "en-US" : "id-ID");
}

export function PriceTierSelector({
  tiers,
  selectedIndex,
  onSelect,
  currencyCode = "IDR",
  locale = "id",
}: PriceTierSelectorProps) {
  if (!tiers?.length) {
    return null;
  }

  const premiumIndex = tiers.length - 1;

  const gridColsClass =
    tiers.length === 1
      ? "grid-cols-1 max-w-[460px]"
      : tiers.length === 2
        ? "grid-cols-1 sm:grid-cols-2 max-w-[950px]"
        : "grid-cols-1 md:grid-cols-3";

  return (
    <div className="w-full mt-5">
      <div
        className={`
          grid
          ${gridColsClass}
          gap-4
          lg:gap-6
          items-stretch
          mx-auto
          w-full
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

          const title = tier.label || getTierTitle(index, tiers.length);

          const subtitle =
            tier.subtitle || getTierSubtitle(index, tiers.length, locale);

          const badge = tier.badge || (isPremium ? "Best Value!" : null);

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
                h-full
                text-center
                rounded-[22px]
                transition-all
                duration-200
                focus:outline-none
                ${isSelected ? "ring-2 ring-[#BE9B84] ring-offset-2" : ""}
              `}>
              <div
                className={`
                  flex
                  flex-col
                  h-full
                  min-h-[290px]
                  sm:min-h-[315px]
                  lg:min-h-[340px]
                  overflow-hidden
                  rounded-[22px]
                  transition-shadow
                  duration-200
                  ${isPremium ? "bg-[#E2D9D4]" : "bg-[#EEEEEE]"}
                  ${
                    isSelected
                      ? "shadow-md"
                      : "shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md"
                  }
                `}>
                {/* PREMIUM HEADER */}
                {badge && (
                  <div
                    className="
                      w-full
                      shrink-0
                      bg-[#BE9B84]
                      px-4
                      py-4
                      sm:py-5
                      text-white
                      text-[18px]
                      sm:text-[20px]
                      lg:text-[22px]
                      leading-none
                      font-semibold
                    ">
                    {badge}
                  </div>
                )}

                {/* BODY */}
                <div
                  className="
                    flex
                    flex-1
                    flex-col
                    px-5
                    sm:px-6
                    lg:px-7
                    pt-7
                    sm:pt-8
                    pb-7
                  ">
                  {/* TITLE */}
                  <div className="shrink-0">
                    <h3
                      className="
                        text-[#111111]
                        text-[21px]
                        sm:text-[24px]
                        lg:text-[27px]
                        leading-[1.05]
                        font-bold
                        tracking-[-0.025em]
                      ">
                      {title}
                    </h3>

                    {subtitle && (
                      <p
                        className="
                          mt-1
                          text-[#494949]
                          text-[12px]
                          sm:text-[13px]
                          lg:text-[14px]
                          leading-[1.3]
                          font-normal
                        ">
                        {subtitle}
                      </p>
                    )}
                  </div>

                  {/* PRICE BOX */}
                  <div
                    className="
                      mt-auto
                      pt-6
                      sm:pt-7
                    ">
                    <div
                      className="
                        flex
                        min-h-[112px]
                        sm:min-h-[125px]
                        w-full
                        flex-col
                        items-center
                        justify-center
                        rounded-[14px]
                        bg-white
                        px-3
                        py-5
                        shadow-[0_1px_4px_rgba(0,0,0,0.025)]
                      ">
                      <div
                        className="
                          flex
                          items-baseline
                          justify-center
                          whitespace-nowrap
                          text-[#201F1E]
                        ">
                        <span
                          className="
                            text-[22px]
                            sm:text-[27px]
                            lg:text-[31px]
                            font-extrabold
                            leading-none
                            tracking-[-0.035em]
                          ">
                          {formatCurrency(price, currencyCode)}
                        </span>

                        <span
                          className="
                            ml-1
                            text-[16px]
                            sm:text-[18px]
                            lg:text-[21px]
                            font-bold
                            leading-none
                          ">
                          /pcs
                        </span>
                      </div>

                      <p
                        className="
                          mt-3
                          text-[13px]
                          sm:text-[14px]
                          lg:text-[16px]
                          italic
                          font-normal
                          leading-none
                          text-[#4F4F4F]
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
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
