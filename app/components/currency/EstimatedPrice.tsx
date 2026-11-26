"use client";

import { useCurrency } from "@/providers/CurrencyProvider";
import { useLocale } from "next-intl";

interface EstimatedPriceProps {
  amountIdr: number;
  sourceCurrency?: string;
  perPcs?: boolean;
  showPaymentNote?: boolean;
  className?: string;
}

export default function EstimatedPrice({
  amountIdr,
  sourceCurrency = "IDR",
  perPcs = false,
  showPaymentNote = false,
  className = "",
}: EstimatedPriceProps) {
  const locale = useLocale();

  const { currency, estimatePrice, isLoading } = useCurrency();

  if (
    sourceCurrency !== "IDR" ||
    currency === "IDR" ||
    isLoading ||
    !Number.isFinite(amountIdr) ||
    amountIdr <= 0
  ) {
    return null;
  }

  const converted = estimatePrice(amountIdr);

  if (converted === null) {
    return null;
  }

  const formatted = new Intl.NumberFormat(locale === "en" ? "en-US" : "id-ID", {
    style: "currency",
    currency,
    currencyDisplay: "code",
  }).format(converted);

  return (
    <div
      data-currency-estimate="true"
      className={`text-xs font-normal text-stone-500 leading-relaxed ${className}`}>
      <p className="font-normal">
        {locale === "en" ? "Estimated price:" : "Estimasi harga:"} ≈ {formatted}
        {perPcs ? "/pcs" : ""}
      </p>

      {showPaymentNote && (
        <p className="mt-0.5 text-[10px]">
          {locale === "en"
            ? "Final payment is in IDR."
            : "Pembayaran akhir menggunakan IDR."}
        </p>
      )}
    </div>
  );
}
