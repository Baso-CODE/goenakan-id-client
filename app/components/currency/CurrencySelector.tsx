"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/providers/CurrencyProvider";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";

const CURRENCIES = [
  { code: "IDR", name: "Indonesian Rupiah" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "USD", name: "US Dollar" },
  { code: "MYR", name: "Malaysian Ringgit" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "KRW", name: "South Korean Won" },
  { code: "THB", name: "Thai Baht" },
  { code: "INR", name: "Indian Rupee" },
];

interface CurrencySelectorProps {
  className?: string;
}

export default function CurrencySelector({
  className = "",
}: CurrencySelectorProps) {
  const locale = useLocale();
  const isEnglish = locale === "en";

  const [open, setOpen] = useState(false);

  const {
    currency,
    preference,
    detectedCurrency,
    setPreference,
    isLoading,
    rate,
  } = useCurrency();

  // Pertahankan currency hasil deteksi backend
  // meskipun belum tersedia dalam daftar default.
  const availableCurrencies = [...CURRENCIES];

  [detectedCurrency, preference, currency].forEach((code) => {
    if (
      code !== "AUTO" &&
      /^[A-Z]{3}$/.test(code) &&
      !availableCurrencies.some((item) => item.code === code)
    ) {
      availableCurrencies.push({
        code,
        name: code,
      });
    }
  });

  const handleSelectCurrency = (code: string) => {
    setPreference(code);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* =====================================
          CURRENCY TRIGGER
      ====================================== */}
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={
            isEnglish ? "Select estimated currency" : "Pilih estimasi mata uang"
          }
          aria-busy={isLoading}
          className={cn(
            "inline-flex h-9 w-[76px] shrink-0 items-center justify-between gap-1.5",
            "rounded-md border border-stone-200 bg-transparent px-2.5",
            "font-sans text-[12px] font-medium tracking-wide text-stone-700",
            "cursor-pointer transition-colors duration-200",
            "hover:border-[#C4A48E] hover:bg-stone-50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A48E]/40",
            open && "border-[#C4A48E] bg-stone-50",
            className,
          )}>
          <span className={cn("tabular-nums", isLoading && "opacity-50")}>
            {currency}
          </span>

          <ChevronDown
            strokeWidth={1.6}
            className={cn(
              "h-3.5 w-3.5 shrink-0 text-stone-500 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      </PopoverTrigger>

      {/* =====================================
          CURRENCY DROPDOWN
      ====================================== */}
      <PopoverContent
        align="end"
        sideOffset={10}
        className="
          z-[60]
          w-[280px]
          max-w-[calc(100vw-2rem)]
          overflow-hidden
          rounded-xl
          border
          border-stone-200
          bg-white
          p-0
          font-sans
          shadow-[0_12px_40px_rgba(70,59,52,0.10)]
        ">
        {/* DROPDOWN HEADER */}
        <div className="border-b border-stone-100 px-4 py-3.5">
          <h3 className="text-sm font-semibold text-stone-800">
            {isEnglish ? "Display currency" : "Tampilan mata uang"}
          </h3>

          <p className="mt-1 text-[11px] leading-relaxed text-stone-500">
            {isEnglish
              ? "Choose your preferred currency for price estimates."
              : "Pilih mata uang untuk menampilkan estimasi harga."}
          </p>
        </div>

        {/* AUTOMATIC CURRENCY */}
        <div className="p-2">
          <button
            type="button"
            aria-pressed={preference === "AUTO"}
            onClick={() => handleSelectCurrency("AUTO")}
            className={cn(
              "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors",
              preference === "AUTO" ? "bg-[#F3EEEA]" : "hover:bg-stone-50",
            )}>
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-[#D9C9BD]
                bg-white
                text-[#8B7565]
              ">
              <Globe className="h-4 w-4" strokeWidth={1.5} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#463B34]">
                {isEnglish ? "Automatic" : "Otomatis"}
                {" · "}
                {detectedCurrency}
              </p>

              <p className="mt-0.5 text-[10px] text-stone-500">
                {isEnglish
                  ? "Based on your location"
                  : "Berdasarkan lokasi Anda"}
              </p>
            </div>

            {preference === "AUTO" && (
              <Check className="h-4 w-4 shrink-0 text-[#8B7565]" />
            )}
          </button>
        </div>

        {/* MANUAL CURRENCY OPTIONS */}
        <div className="border-t border-stone-100 px-2 pb-2 pt-3">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400">
            {isEnglish ? "Available currencies" : "Pilihan mata uang"}
          </p>

          <div
            className="
              max-h-[240px]
              space-y-0.5
              overflow-y-auto
              overscroll-contain
              [scrollbar-width:thin]
            ">
            {availableCurrencies.map((item) => {
              const isSelected = preference === item.code;

              return (
                <button
                  key={item.code}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleSelectCurrency(item.code)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
                    isSelected ? "bg-[#F3EEEA]" : "hover:bg-stone-50",
                  )}>
                  <span className="w-9 shrink-0 text-xs font-semibold text-stone-800">
                    {item.code}
                  </span>

                  <span className="flex-1 text-[11px] text-stone-500">
                    {item.name}
                  </span>

                  {isSelected && (
                    <Check className="h-3.5 w-3.5 shrink-0 text-[#8B7565]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* PAYMENT INFORMATION */}
        <div className="border-t border-stone-100 bg-stone-50 px-4 py-3">
          <p className="text-[10px] leading-relaxed text-stone-500">
            {isEnglish
              ? "Foreign currency prices are estimates only. All payments are processed in IDR."
              : "Harga mata uang asing hanya merupakan estimasi. Seluruh pembayaran menggunakan IDR."}
          </p>

          {!isLoading && rate === null && (
            <p className="mt-2 text-[10px] text-amber-700">
              {isEnglish
                ? "Estimates are currently unavailable."
                : "Estimasi sedang tidak tersedia."}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
