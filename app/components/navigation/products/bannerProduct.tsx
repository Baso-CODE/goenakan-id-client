"use client";

import { getPublicBannersProduct } from "@/app/api/products/getBannerProduct.api";
import { BannerProduct as BannerType } from "@/app/types/bannerProduct.type";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface HeroBannerCarouselProps {
  interval?: number;
}

export function BannerProduct({
  interval = 3500,
}: HeroBannerCarouselProps = {}) {
  const [slides, setSlides] = useState<BannerType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const apiRef = useRef<CarouselApi | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const loadBanners = async () => {
      setIsLoading(true);
      try {
        const data = await getPublicBannersProduct();
        setSlides(data);
      } catch (error) {
        console.error("Gagal memuat banner di komponen:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBanners();
  }, []);

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
    if (!isLoading && slides.length > 0) {
      startAutoplay();
    }
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay, isLoading, slides.length]);

  // Loading State
  if (isLoading) {
    return (
      <div className="w-full pt-23.25 min-h-75 flex items-center justify-center bg-stone-50">
        <span className="text-stone-400 text-sm animate-pulse">
          Memuat banner...
        </span>
      </div>
    );
  }

  // Empty State
  if (!slides || slides.length === 0) {
    return (
      <section className="w-full pt-23.25">
        <div className="w-full aspect-16/7 bg-stone-50 flex flex-col items-center justify-center border-2 border-dashed border-stone-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-stone-300 mb-3">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>

          <p className="text-stone-600 font-medium text-sm md:text-base">
            Belum ada banner promosi
          </p>
          <p className="text-stone-400 text-xs md:text-sm mt-1">
            Banner promosi yang aktif akan ditampilkan di area ini.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="w-full pt-23.25"
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}>
      <Carousel
        setApi={(api) => {
          apiRef.current = api;
        }}
        opts={{ align: "start", loop: true }}
        className="w-full">
        <CarouselContent className="ml-0">
          {slides.map((slide) => (
            <CarouselItem
              key={slide.id}
              className="pl-0 basis-full sm:basis-1/2 lg:basis-1/3">
              <BannerSlideItem slide={slide} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

function BannerSlideItem({ slide }: { slide: BannerType }) {
  const content = (
    <div className="relative w-full aspect-16/7 overflow-hidden group bg-stone-100">
      {slide.imageUrl && (
        <Image
          src={slide.imageUrl}
          alt={slide.title || "Promo Banner"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}

      {(slide.title || slide.subtitle) && (
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
      )}

      {(slide.title || slide.subtitle) && (
        <div className="absolute bottom-0 left-0 p-5">
          {slide.title && (
            <p className="text-white font-semibold text-base leading-tight tracking-wide drop-shadow-md">
              {slide.title}
            </p>
          )}
          {slide.subtitle && (
            <p className="text-white/80 text-sm mt-0.5 drop-shadow-md">
              {slide.subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (slide.linkUrl) {
    return (
      <Link href={slide.linkUrl} className="block w-full">
        {content}
      </Link>
    );
  }

  return content;
}
