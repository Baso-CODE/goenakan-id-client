"use client";

import { Article } from "@/app/types/articles/articleList.type";
import { Link } from "@/i18n/routing";
import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface RelevantArticleProps {
  currentArticleId?: string;
  articles?: Article[];
  title?: string;
  pageSize?: number;
}

export function RelevantArticle({
  currentArticleId,
  articles = [],
  title = "Relevant Article",
  pageSize = 6,
}: RelevantArticleProps) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [isLoading, setIsLoading] = useState(false);

  const filtered = (articles || []).filter((a) => a.id !== currentArticleId);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulasi loading sebentar
    setTimeout(() => {
      setVisibleCount((v) => v + pageSize);
      setIsLoading(false);
    }, 400);
  };

  // Jika tidak ada artikel relevan, tidak perlu render section ini
  if (!articles || articles.length === 0) return null;

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
            className="border border-stone-300 text-stone-600 text-sm px-8 py-2 rounded-sm hover:bg-stone-50 transition-colors disabled:opacity-50 cursor-pointer">
            {isLoading ? "loading..." : "load more"}
          </button>
        </div>
      )}
    </section>
  );
}

function RelevantArticleCard({ article }: { article: Article }) {
  return (
    <Link href={article.href} className="group flex flex-col gap-3">
      {/* Container Image dengan Rasio Tetap (16:10) */}
      <div className="relative w-full aspect-16/10 bg-stone-100 overflow-hidden rounded-md border border-stone-50 flex items-center justify-center">
        {/*  PENGKONDISIAN GAMBAR */}
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          /*  TAMPILAN JIKA TIDAK ADA GAMBAR */
          <div className="flex flex-col items-center justify-center text-stone-400 p-4">
            {/* Ukuran ikon sedikit diperkecil (w-8 h-8) agar proporsional dengan kartu ini */}
            <ImageOff className="w-8 h-8 mb-2 stroke-[1.5]" />
            <span className="text-[11px] uppercase tracking-wider font-medium">
              No Image
            </span>
          </div>
        )}
      </div>

      {/* Konten Teks */}
      <div className="flex flex-col gap-1.5 px-1">
        <h3 className="text-[15px] font-bold text-stone-800 leading-tight group-hover:text-[#C4A48E] transition-colors line-clamp-2">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-[13px] text-stone-500 leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
