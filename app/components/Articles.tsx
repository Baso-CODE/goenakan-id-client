"use client";

import {
  ArticleBannerCarousel,
  type ArticleBanner,
} from "@/app/components/article/articleBannerCarousel";

import ArticlesClient from "./ArticlesClient";

interface ArticlesProps {
  banners: ArticleBanner[];
}

export default function Articles({ banners }: ArticlesProps) {
  return (
    <section className="w-full bg-white pb-24">
      {banners.length > 0 && (
        <ArticleBannerCarousel articles={banners} interval={5000} />
      )}

      <ArticlesClient />
    </section>
  );
}
