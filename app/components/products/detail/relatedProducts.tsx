"use client";

import { RelatedProduct } from "@/app/api/products/getRelatedProducts.api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Link } from "@/i18n/routing";
import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

interface RelatedProductsProps {
  products: RelatedProduct[];
  title?: string;
  interval?: number;
}

// ==========================================
// MULTI-CURRENCY FORMATTER
// ==========================================

const currencyFormatterCache = new Map<string, Intl.NumberFormat>();

function formatCurrency(amount: number, currencyCode: string = "IDR"): string {
  const currency = currencyCode?.trim().toUpperCase() || "IDR";

  const localeMap: Record<string, string> = {
    IDR: "id-ID",
    SGD: "en-SG",
    USD: "en-US",
    MYR: "ms-MY",
    CNY: "zh-CN",
    EUR: "de-DE",
    JPY: "ja-JP",
    GBP: "en-GB",
    AUD: "en-AU",
  };

  const locale = localeMap[currency] || "en-US";
  const cacheKey = `${locale}:${currency}`;

  let formatter = currencyFormatterCache.get(cacheKey);

  if (!formatter) {
    try {
      formatter = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        currencyDisplay: "symbol",
        minimumFractionDigits: currency === "IDR" ? 0 : 2,
        maximumFractionDigits: currency === "IDR" ? 0 : 2,
      });
    } catch {
      // Hindari UI crash bila kode currency invalid.
      return `${currency} ${Number(amount).toFixed(2)}`;
    }

    currencyFormatterCache.set(cacheKey, formatter);
  }

  const safeAmount = Number.isFinite(amount) ? amount : 0;

  const formatted = formatter.format(safeAmount);

  // Bedakan Singapore Dollar dari USD.
  if (currency === "SGD") {
    return formatted.replace(/^\$/, "S$");
  }

  return formatted;
}

// ==========================================
// RELATED PRODUCTS CAROUSEL
// ==========================================

export function RelatedProducts({
  products,
  title = "You Might Also Like",
  interval = 3000,
}: RelatedProductsProps) {
  const apiRef = useRef<CarouselApi | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (products.length <= 1) return;

    timerRef.current = setInterval(() => {
      if (!apiRef.current) return;

      if (apiRef.current.canScrollNext()) {
        apiRef.current.scrollNext();
      } else {
        apiRef.current.scrollTo(0);
      }
    }, interval);
  }, [interval, products.length]);

  const stopAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();

    return () => {
      stopAutoplay();
    };
  }, [startAutoplay, stopAutoplay]);

  if (!products.length) return null;

  return (
    <section
      className="w-full py-8 border-t border-stone-100 max-w-8xl mx-auto px-4 sm:px-6"
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}>
      <h2 className="text-sm font-semibold text-stone-700 mb-4">{title}</h2>

      <Carousel
        setApi={(api) => {
          apiRef.current = api;
        }}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full">
        <CarouselContent className="-ml-3">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
              <RelatedProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

// ==========================================
// RELATED PRODUCT CARD
// ==========================================

function RelatedProductCard({ product }: { product: RelatedProduct }) {
  const currency = product.currencyCode || "IDR";

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="flex flex-col gap-2">
        {/* PRODUCT IMAGE */}
        <div className="relative aspect-square w-full bg-stone-50 overflow-hidden rounded-sm flex items-center justify-center">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="flex flex-col items-center text-stone-400 transition-transform duration-500 group-hover:scale-105">
              <ImageOff className="w-8 h-8 mb-2 stroke-[1.5]" />

              <span className="text-[10px] font-medium uppercase tracking-wider">
                No Image
              </span>
            </div>
          )}
        </div>

        {/* PRODUCT INFO */}
        <div className="flex flex-col gap-0.5">
          <p className="text-sm text-stone-800 font-medium leading-snug line-clamp-2 group-hover:text-stone-600 transition-colors">
            {product.name}
          </p>

          <p className="text-sm font-semibold text-stone-600">
            {formatCurrency(product.bulkPrice, currency)}
          </p>
        </div>
      </div>
    </Link>
  );
}
