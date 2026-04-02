"use client";

import { DUMMY_ARTICLES } from "@/app/data/article.data";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Article } from "../articlelist";

interface RelevantArticleProps {
  currentArticleId?: string;
  articles?: Article[];
  title?: string;
  pageSize?: number;
}

export function RelevantArticle({
  currentArticleId,
  articles = DUMMY_ARTICLES,
  title = "Relevant Article",
  pageSize = 6,
}: RelevantArticleProps) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [isLoading, setIsLoading] = useState(false);

  // Filter out current article
  const filtered = articles.filter((a) => a.id !== currentArticleId);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((v) => v + pageSize);
      setIsLoading(false);
    }, 400);
  };

  return (
    <section className="w-full py-8 border-t border-stone-100 mt-8">
      <h2 className="text-sm font-semibold text-stone-800 mb-5">{title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visible.map((article) => (
          <RelevantArticleCard key={article.id} article={article} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
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

function RelevantArticleCard({ article }: { article: Article }) {
  return (
    <Link href={article.href} className="group flex flex-col gap-2.5">
      {/* Image */}
      <div className="relative w-full aspect-[4/3] bg-stone-200 rounded-sm overflow-hidden">
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
        <h3 className="text-sm font-semibold text-stone-800 leading-snug line-clamp-2 group-hover:text-stone-500 transition-colors">
          {article.title}
        </h3>
        <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
}
