"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useCallback, useEffect, useRef } from "react";

export interface BannerSlide {
  id: string;
  color: string; // Tailwind bg class, e.g. "bg-stone-400"
  title?: string;
  subtitle?: string;
  href?: string;
}

interface HeroBannerCarouselProps {
  slides?: BannerSlide[];
  interval?: number;
}

const DEFAULT_SLIDES: BannerSlide[] = [
  {
    id: "1",
    color: "bg-stone-500",
    title: "New Collection",
    subtitle: "Explore our latest products",
    href: "/products",
  },
  {
    id: "2",
    color: "bg-stone-300",
    title: "Best Sellers",
    subtitle: "Shop what everyone loves",
    href: "/products",
  },
  {
    id: "3",
    color: "bg-stone-200",
    title: "Special Offer",
    subtitle: "Min. order 100 pcs",
    href: "/products",
  },
  {
    id: "4",
    color: "bg-stone-400",
    title: "Custom Order",
    subtitle: "Personalize your product",
    href: "/products",
  },
];

export function BannerProduct({
  slides = DEFAULT_SLIDES,
  interval = 3500,
}: HeroBannerCarouselProps) {
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

function BannerSlideItem({ slide }: { slide: BannerSlide }) {
  const content = (
    <div
      className={`relative w-full aspect-16/7 overflow-hidden group ${slide.color}`}>
      {(slide.title || slide.subtitle) && (
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
      )}
      {(slide.title || slide.subtitle) && (
        <div className="absolute bottom-0 left-0 p-5">
          {slide.title && (
            <p className="text-white font-semibold text-base leading-tight tracking-wide drop-shadow">
              {slide.title}
            </p>
          )}
          {slide.subtitle && (
            <p className="text-white/80 text-sm mt-0.5 drop-shadow">
              {slide.subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (slide.href) {
    return (
      <a href={slide.href} className="block w-full">
        {content}
      </a>
    );
  }

  return content;
}
