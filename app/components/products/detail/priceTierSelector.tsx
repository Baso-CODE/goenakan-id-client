"use client";

import { PriceTier } from "@/app/types/productDetail.type";

interface PriceTierSelectorProps {
  tiers: PriceTier[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  })
    .format(amount)
    .replace("IDR", "IDR");
}

export function PriceTierSelector({
  tiers,
  selectedIndex,
  onSelect,
}: PriceTierSelectorProps) {
  const BADGE_H = "h-7"; // tinggi badge — samakan dengan pt di card bawahnya

  return (
    // items-end → semua card rata bawah
    <div className="grid grid-cols-3 gap-2 items-end">
      {tiers.map((tier, index) => {
        const isSelected = selectedIndex === index;

        return (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`relative flex flex-col w-full text-center rounded-sm border transition-all duration-150 overflow-visible ${
              isSelected
                ? "border-stone-800 ring-1 ring-stone-800"
                : "border-stone-200 hover:border-stone-400"
            }`}>
            {tier.badge && (
              <span
                className={`absolute left-0 right-0 -top-7 ${BADGE_H} flex items-center justify-center bg-[#b5956a] text-white text-md font-bold rounded-t-sm ${
                  isSelected ? "ring-1 ring-stone-800 ring-b-0" : ""
                }`}>
                {tier.badge}
              </span>
            )}

            {/* Card body */}
            <div className="flex flex-col items-center px-3 pt-3 pb-4 bg-white rounded-sm w-full">
              <p className="font-semibold text-stone-800 text-sm leading-tight">
                {tier.label}
              </p>
              <p className="text-stone-800 text-[11px] mt-0.5 leading-tight">
                {tier.subtitle}
              </p>
              <div className="mt-3">
                <p className="font-bold text-stone-900 text-base leading-none">
                  {formatRupiah(tier.pricePerPcs)}/pcs
                </p>
                <p className="text-stone-700 text-[11px] mt-1">
                  {tier.minQty.toLocaleString("id-ID")}
                  {tier.maxQty
                    ? ` — ${tier.maxQty.toLocaleString("id-ID")} pcs`
                    : `,001+ pcs`}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
