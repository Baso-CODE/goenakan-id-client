"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ArticleBanner {
  id: string;
  tag?: string;
  title: string;
  date: string;
  href: string;
  image: string;
  imageAlt?: string;
  // 🟢 Tambahkan field custom dari database
  backgroundColor?: string;
  buttonText?: string;
}

interface ArticleBannerCarouselProps {
  articles: ArticleBanner[];
  interval?: number;
}

export function ArticleBannerCarousel({
  articles = [],
  interval = 5000,
}: ArticleBannerCarouselProps) {
  const apiRef = useRef<CarouselApi | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [current, setCurrent] = useState(0);

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

  useEffect(() => {
    if (!apiRef.current) return;
    apiRef.current.on("select", () => {
      setCurrent(apiRef.current!.selectedScrollSnap());
    });
  }, []);

  // Jika tidak ada banner, jangan render carousel
  if (!articles || articles.length === 0) return null;

  return (
    <section
      className="w-full"
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}>
      <Carousel
        setApi={(api) => {
          apiRef.current = api;
          if (api) {
            api.on("select", () => setCurrent(api.selectedScrollSnap()));
          }
        }}
        opts={{ align: "start", loop: true }}
        className="w-full">
        <CarouselContent className="ml-0">
          {articles.map((article) => (
            <CarouselItem key={article.id} className="pl-0">
              <ArticleBannerSlide article={article} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

function ArticleBannerSlide({ article }: { article: ArticleBanner }) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 w-full pt-24"
      style={{ minHeight: 620 }}>
      {/* Left — Text */}
      <div
        className="flex flex-col justify-center px-10 py-10 gap-4"
        style={{ backgroundColor: article.backgroundColor || "#3d342b" }}>
        {article.tag && (
          <span className="inline-block border border-white/40 bg-[#e1dad6] text-neutral-900 text-[13px] tracking-widest uppercase px-2.5 py-1 rounded-full w-fit">
            {article.tag}
          </span>
        )}

        <h2 className="text-white text-3xl md:text-5xl font-light leading-snug">
          {article.title}
        </h2>

        <p className="text-white text-sm">{article.date}</p>

        <Link
          href={article.href}
          className="inline-flex items-center gap-1.5 border bg-[#e1dad6] border-white/40 text-slate-900 text-sm px-4 py-2 rounded-sm hover:bg-white/10 hover:text-white transition-colors w-fit mt-1">
          {article.buttonText || "Read article"}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </Link>
      </div>

      {/* Right — Image */}
      <div className="relative bg-stone-100 overflow-hidden min-h-75 md:min-h-full">
        <Image
          src={article.image}
          alt={article.imageAlt ?? article.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  );
}
