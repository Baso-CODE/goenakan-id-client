"use client";

import { Product } from "@/app/products/types/product.type";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";

interface RelatedProductsProps {
  products: Product[];
  title?: string;
  interval?: number;
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  })
    .format(amount)
    .replace("IDR", "Rp")
    .trim();
}

export function RelatedProducts({
  products,
  title = "You Might Also Like",
  interval = 3000,
}: RelatedProductsProps) {
  const apiRef = useRef<CarouselApi | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!apiRef.current) return;
      if (apiRef.current.canScrollNext()) {
        apiRef.current.scrollNext();
      } else {
        apiRef.current.scrollTo(0);
      }
    }, interval);
  }, [interval]);

  const stopAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  if (!products.length) return null;

  return (
    <section
      className="w-full py-8 border-t border-stone- 100 max-w-8xl mx-auto px-4 sm:px-6  "
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}>
      {/* Title */}
      <h2 className="text-sm font-semibold text-stone-700 mb-4">{title}</h2>

      <Carousel
        setApi={(api) => {
          apiRef.current = api;
        }}
        opts={{ align: "start", loop: true }}
        className="w-full">
        <CarouselContent className="-ml-3">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              // Desktop: 5 items, Tablet: 3, Mobile: 2
              className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
              <RelatedProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

function RelatedProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="flex flex-col gap-2">
        {/* Image */}
        <div className="relative aspect-square w-full bg-stone-50 overflow-hidden rounded-sm">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-0.5">
          <p className="text-sm text-stone-800 font-medium leading-snug line-clamp-2 group-hover:text-stone-600 transition-colors">
            {product.name}
          </p>
          <p className="text-sm text-stone-500">
            {formatRupiah(product.bulkPrice)}
          </p>
        </div>
      </div>
    </Link>
  );
}
