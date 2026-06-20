"use client";

import { apiUrl } from "@/app/utils/ApiUrl";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "@/i18n/routing";
import Autoplay from "embla-carousel-autoplay";
import { useLocale } from "next-intl";
import Image from "next/image";
import * as React from "react";
import { useEffect, useState } from "react";
import { ArticleApiItem } from "../types/articles/articleApiItem.type";

// --- DATA DUMMY BANNER (Tetap) ---
const bannerSlides = [
  { id: 1, image: "/images/blog/banner-article.png" },
  { id: 2, image: "/images/blog/banner-article.png" },
  { id: 3, image: "/images/blog/banner-article.png" },
];

const stripHtml = (html: string) => {
  if (typeof document === "undefined") return html.replace(/<[^>]+>/g, "");
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  slug: string;
}

export default function Articles() {
  const locale = useLocale(); // ✨ DETEKSI BAHASA AKTIF ("id" atau "en")

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true }),
  );

  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✨ TEKS STATIS MULTIBAHASA
  const dict = {
    title: locale === "en" ? "Articles" : "Artikel",
    loading: locale === "en" ? "Loading articles..." : "Memuat artikel...",
    empty:
      locale === "en"
        ? "No articles published yet."
        : "Belum ada artikel yang dipublikasikan.",
    readMore: locale === "en" ? "Read more" : "Baca selengkapnya",
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Ambil 6 artikel terbaru
        const res = await fetch(`${apiUrl}/articles/list?take=6&sort=newest`);
        if (!res.ok) throw new Error("Gagal mengambil data artikel");

        const json = await res.json();

        const formatted: Article[] = json.data.map((item: ArticleApiItem) => {
          const mappedTitle =
            locale === "en" && item.title_en ? item.title_en : item.title_id;
          const mappedContent =
            locale === "en" && item.content_en
              ? item.content_en
              : item.content_id;

          const plainText = stripHtml(mappedContent || "");

          return {
            id: item.id,
            title: mappedTitle,
            excerpt:
              plainText.length > 120
                ? plainText.substring(0, 120) + "..."
                : plainText,
            image: item.coverImage,
            slug: item.slug || item.id,
          };
        });

        setArticles(formatted);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [locale]); // Menambahkan locale di dependency array agar re-render jika bahasa diganti

  return (
    <section className="w-full bg-white pb-24">
      {/* =========================================
          BAGIAN 1: TOP SLIDER BANNER (TIDAK DIUBAH)
         ========================================= */}
      <div className="w-full h-100 md:h-125 relative mb-16 bg-gray-100">
        <Carousel
          plugins={[plugin.current]}
          className="w-full h-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{ loop: true }}>
          <CarouselContent>
            {bannerSlides.map((slide) => (
              <CarouselItem
                key={slide.id}
                className="relative w-full h-100 md:h-125">
                <div className="relative w-full h-full">
                  <Image
                    src={slide.image}
                    alt="Blog Banner"
                    fill
                    className="object-cover"
                    priority={slide.id === 1}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="left-4 bg-white/50 border-none hover:bg-white hidden md:flex" />
          <CarouselNext className="right-4 bg-white/50 border-none hover:bg-white hidden md:flex" />
        </Carousel>
      </div>

      {/* =========================================
          BAGIAN 2: ARTICLE GRID
         ========================================= */}
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl text-gray-900 uppercase tracking-wide">
            {dict.title}
          </h2>
        </div>
        {isLoading ? (
          <div className="text-center py-20 text-gray-500 animate-pulse">
            {dict.loading}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-gray-500">{dict.empty}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 mb-16">
            {articles.map((article) => (
              <Link
                href={`/article/${article.slug}`}
                key={article.id}
                className="group cursor-pointer flex flex-col h-full">
                {/* Gambar Artikel */}
                <div className="relative aspect-square w-full bg-gray-200 mb-6 overflow-hidden">
                  {article.image ? (
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
                      FOTO ARTIKEL
                    </div>
                  )}
                </div>

                {/* Konten Teks */}
                <div className="flex flex-col grow">
                  <h3 className="text-lg font-bold text-gray-900 leading-snug mb-3 line-clamp-2 group-hover:text-[#C4A48E] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Tombol Read More */}
        <div className="flex justify-center">
          <Link href="/article">
            <Button className="bg-[#C4A48E] hover:bg-[#b08e75] text-white rounded-none px-10 py-6 text-base font-medium">
              {dict.readMore}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
