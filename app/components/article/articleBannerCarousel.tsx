"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ArticleBanner {
  id: string;
  tag?: string;
  title: string;
  date: string;
  href: string;
  image: string;
  imageAlt?: string;
}

interface ArticleBannerCarouselProps {
  articles: ArticleBanner[];
  interval?: number;
}

const DEFAULT_ARTICLES: ArticleBanner[] = [
  {
    id: "1",
    tag: "THE BLOG",
    title:
      "15 Ide Hampers Premium Korporat: Eksklusif dan Tepat untuk Klien VIP",
    date: "February 2, 2026",
    href: "/article/hampers-premium-korporat",
    image: "/images/articles/article-1.jpg",
    imageAlt: "Hampers Premium Korporat",
  },
  {
    id: "2",
    tag: "THE BLOG",
    title: "Tips Memilih Souvenir Custom yang Berkesan untuk Acara Perusahaan",
    date: "January 15, 2026",
    href: "/article/souvenir-custom-perusahaan",
    image: "/images/articles/article-2.jpg",
    imageAlt: "Souvenir Custom Perusahaan",
  },
  {
    id: "3",
    tag: "THE BLOG",
    title: "Mengapa Produk Bambu Menjadi Pilihan Utama Merchandise Modern",
    date: "December 20, 2025",
    href: "/article/produk-bambu-merchandise",
    image: "/images/articles/article-3.jpg",
    imageAlt: "Produk Bambu Merchandise",
  },
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function ArticleBannerCarousel({
  articles = DEFAULT_ARTICLES,
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

        {/* Prev / Next arrows */}
        {/* <CarouselPrevious className="left-4 bg-white/80 hover:bg-white border-0 shadow-sm" />
        <CarouselNext className="right-4 bg-white/80 hover:bg-white border-0 shadow-sm" /> */}
      </Carousel>

      {/* Dot indicators */}
      {/* <div className="flex justify-center gap-1.5 mt-3">
        {articles.map((_, i) => (
          <button
            key={i}
            onClick={() => apiRef.current?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              current === i ? "w-5 bg-stone-700" : "w-1.5 bg-stone-300"
            }`}
          />
        ))}
      </div> */}
    </section>
  );
}

function ArticleBannerSlide({ article }: { article: ArticleBanner }) {
  return (
    <div className="grid grid-cols-2 w-full pt-24" style={{ minHeight: 620 }}>
      {/* Left — Text */}
      <div className="bg-[#3d342b] flex flex-col justify-center px-10 py-10 gap-4">
        {article.tag && (
          <span className="inline-block border border-white/40 bg-[#e1dad6] text-neutral-900 text-[13px] tracking-widest uppercase px-2.5 py-1 rounded-full w-fit">
            {article.tag}
          </span>
        )}

        <h2 className="text-white text-3xl md:text-5xl font-light leading-snug">
          {article.title}
        </h2>

        <p className="text-white text-sm">{formatDate(article.date)}</p>

        <Link
          href={article.href}
          className="inline-flex items-center gap-1.5 border bg-[#e1dad6] border-white/40 text-slate-900 text-sm px-4 py-2 rounded-sm hover:bg-white/10 hover:text-white transition-colors w-fit mt-1">
          Read article
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
      <div className="relative bg-stone-100 overflow-hidden">
        <Image
          src={article.image}
          alt={article.imageAlt ?? article.title}
          fill
          className="object-cover"
          sizes="50vw"
          priority
        />
      </div>
    </div>
  );
}
