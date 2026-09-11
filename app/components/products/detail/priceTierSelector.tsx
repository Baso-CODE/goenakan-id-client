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

// 🛠️ LOGIKA 1: Penamaan judul otomatis berdasarkan jumlah tier
function getTierTitle(index: number, total: number, locale: string) {
  if (total === 1) return "Premium Order";
  if (total === 2) return index === 0 ? "Starter Order" : "Premium Order";

  const titles = ["Starter Order", "Standard Order", "Premium Order"];
  return titles[index] || `Tier ${index + 1}`;
}

// 🛠️ LOGIKA 2: Penamaan subtitle otomatis berdasarkan jumlah tier
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

  if (total === 1) return subs[2];
  if (total === 2) return index === 0 ? subs[0] : subs[2];

  return subs[index] || "";
}

export function PriceTierSelector({
  tiers,
  selectedIndex,
  onSelect,
  currencyCode = "IDR",
  locale = "id",
}: PriceTierSelectorProps) {
  if (!tiers || tiers.length === 0) return null;

  // Premium tier selalu menjadi index terakhir
  const premiumIndex = tiers.length - 1;

  // Agar tampilan tetap proporsional jika jumlah tier kurang dari 3
  const gridColsClass =
    tiers.length === 1
      ? "grid-cols-1 max-w-[240px]"
      : tiers.length === 2
        ? "grid-cols-2 max-w-[480px]"
        : "grid-cols-3 w-full";

  return (
    <div className="mt-4">
      <div className={`grid gap-2 sm:gap-3 items-end ${gridColsClass}`}>
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

          // Badge "Best Value!" hanya untuk premium
          const badge = tier.badge || (isPremium ? "Best Value!" : null);

          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(index)}
              className={`
                group relative w-full text-center transition-all duration-200 
                flex flex-col justify-end rounded-xl
                ${isSelected ? "ring-2 ring-[#bda08c] ring-offset-2" : "hover:scale-[1.02]"}
              `}>
              <div className="flex flex-col h-full w-full shadow-sm rounded-xl overflow-hidden">
                {/* 🌟 Premium Badge Header (Hanya muncul di Tier Premium) */}
                {isPremium && badge && (
                  <div className="bg-[#bda08c] py-2 text-[11px] sm:text-[13px] font-bold text-white tracking-wide">
                    {badge}
                  </div>
                )}

                {/* 🌟 Card Body Container */}
                <div
                  className={`
                    flex flex-col flex-1 justify-between px-2 pt-3 pb-2 sm:px-3 sm:pt-4 sm:pb-3
                    ${isPremium ? "bg-[#e5dcd3]" : "bg-[#f4f4f4]"}
                  `}>
                  {/* Title & Subtitle */}
                  <div className="mb-2">
                    <p className="text-[12px] sm:text-[16px] font-bold text-[#1a1a1a]">
                      {title}
                    </p>
                    {subtitle && (
                      <p className="mt-0.5 text-[8.5px] sm:text-[12px] leading-snug text-[#555] px-1">
                        {subtitle}
                      </p>
                    )}
                  </div>

                  {/* 🌟 Inner White Box (Harga & Kuantitas) */}
                  <div className="bg-white rounded-lg py-2.5 sm:py-3 px-1 flex flex-col items-center justify-center shadow-sm">
                    <p className="text-[#4e3f36] font-extrabold text-[14px] sm:text-[17px] leading-none whitespace-nowrap">
                      {formatCurrency(price, currencyCode)}
                      <span className="text-[10px] sm:text-[12px] font-bold ml-0.5">
                        /pcs
                      </span>
                    </p>
                    <p className="mt-1.5 text-[10px] sm:text-[11px] italic text-[#666] leading-none">
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
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
