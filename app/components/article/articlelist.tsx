"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  href: string;
}

interface ArticleListProps {
  articles?: Article[];
  categories?: string[];
  pageSize?: number;
}

const DEFAULT_CATEGORIES = [
  "All posts",
  "Corporate Hampers",
  "Sustainable Development",
  "Community",
  "Unique",
];

const DEFAULT_ARTICLES: Article[] = Array.from({ length: 9 }, (_, i) => ({
  id: `article-${i + 1}`,
  title: "15 Ide Hampers Premium Korporat: Eksklusif dan Tepat untuk Klien VIP",
  excerpt:
    "Dalam dunia bisnis yang kompetitif, menjaga hubungan dengan klien VIP memerlukan sentuhan khusus. Sa...",
  image: "/images/articles/article-placeholder.jpg",
  category:
    DEFAULT_CATEGORIES[
      Math.floor(Math.random() * (DEFAULT_CATEGORIES.length - 1)) + 1
    ],
  date: "February 2, 2026",
  href: `/article/article-${i + 1}`,
}));

const PAGE_SIZE = 6;

export function ArticleList({
  articles = DEFAULT_ARTICLES,
  categories = DEFAULT_CATEGORIES,
  pageSize = PAGE_SIZE,
}: ArticleListProps) {
  const [activeCategory, setActiveCategory] = useState("All posts");
  const [sort, setSort] = useState<"newest" | "older">("newest");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [isLoading, setIsLoading] = useState(false);

  const filtered = articles
    .filter((a) =>
      activeCategory === "All posts" ? true : a.category === activeCategory,
    )
    .sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sort === "newest" ? db - da : da - db;
    });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((v) => v + pageSize);
      setIsLoading(false);
    }, 500);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setVisibleCount(pageSize);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Filter bar */}
      <div className="flex items-center justify-between mb-6 border-b border-stone-200 pb-3">
        {/* Categories */}
        <div className="flex items-center gap-5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`text-sm transition-colors ${
                activeCategory === cat
                  ? "text-stone-900 font-medium"
                  : "text-stone-400 hover:text-stone-600"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1 text-sm shrink-0">
          <button
            onClick={() => setSort("newest")}
            className={
              sort === "newest"
                ? "text-stone-900 font-medium"
                : "text-stone-400 hover:text-stone-600"
            }>
            newest
          </button>
          <span className="text-stone-300">|</span>
          <button
            onClick={() => setSort("older")}
            className={
              sort === "older"
                ? "text-stone-900 font-medium"
                : "text-stone-400 hover:text-stone-600"
            }>
            older
          </button>
        </div>
      </div>

      {/* Article Grid */}
      {visible.length === 0 ? (
        <div className="text-center py-16 text-stone-400 text-sm">
          No articles found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="border border-stone-300 text-stone-600 text-sm px-8 py-2 rounded-sm hover:bg-stone-50 transition-colors disabled:opacity-50">
            {isLoading ? "loading..." : "load more"}
          </button>
        </div>
      )}
    </section>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={article.href} className="group flex flex-col gap-3">
      {/* Image */}
      <div className="relative w-full aspect-4/3 bg-stone-200 overflow-hidden rounded-sm">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-stone-800 leading-snug group-hover:text-stone-600 transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
}
