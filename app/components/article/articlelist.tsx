"use client";

import { ArticleApiItem } from "@/app/types/articles/articleApiItem.type";
import { Article } from "@/app/types/articles/articleList.type";
import { apiUrl } from "@/app/utils/ApiUrl";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ArticleListProps {
  categories?: string[];
  pageSize?: number;
}

const PAGE_SIZE = 6;

const stripHtml = (html: string) => {
  if (typeof document === "undefined") return html.replace(/<[^>]+>/g, "");
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

export function ArticleList({ pageSize = PAGE_SIZE }: ArticleListProps) {
  const [activeCategory, setActiveCategory] = useState("All posts");
  const [sort, setSort] = useState<"newest" | "older">("newest");
  const [categories, setCategories] = useState<string[]>(["All posts"]);

  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsCategoriesLoading(true);
      try {
        const res = await fetch(`${apiUrl}/article-categories/list`);
        if (!res.ok) throw new Error("Gagal mengambil kategori");
        const data = await res.json();
        const categoryArray = data.data || data;
        const categoryNames = categoryArray.map(
          (cat: { id: string; name: string }) => cat.name,
        );
        setCategories(["All posts", ...categoryNames]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const fetchArticles = async (
    pageNum: number,
    cat: string,
    sortOrder: "newest" | "older",
  ) => {
    setIsLoading(true);
    try {
      let url = `${apiUrl}/articles/list?page=${pageNum}&take=${pageSize}&sort=${sortOrder}`;
      if (cat !== "All posts") {
        url += `&categoryName=${encodeURIComponent(cat)}`;
      }
      const [res] = await Promise.all([
        fetch(url),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);

      if (!res.ok) throw new Error("Gagal mengambil data artikel");

      const json = await res.json();
      const formatted: Article[] = json.data.map((item: ArticleApiItem) => {
        const plainText = stripHtml(item.content);
        return {
          id: item.id,
          title: item.title,
          excerpt:
            plainText.length > 100
              ? plainText.substring(0, 100) + "..."
              : plainText,
          image: item.coverImage || "/images/articles/article-placeholder.jpg",
          category: item.category?.name || "Uncategorized",
          date: new Date(item.publishedAt || item.createdAt).toLocaleDateString(
            "en-US",
            { month: "long", day: "numeric", year: "numeric" },
          ),
          href: `/article/${item.slug || item.id}`,
        };
      });

      if (pageNum === 1) {
        setArticles(formatted);
      } else {
        setArticles((prev) => [...prev, ...formatted]);
      }
      setHasMore(pageNum < json.meta.pageCount);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchArticles(1, activeCategory, sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, sort]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArticles(nextPage, activeCategory, sort);
  };

  const handleCategoryChange = (cat: string) => {
    if (cat !== activeCategory) {
      setActiveCategory(cat);
      setArticles([]);
      setIsLoading(true);
    }
  };

  return (
    <section className="w-full container mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center justify-between mb-6 border-b border-stone-200 pb-3">
        {/* Categories */}
        <div className="flex items-center gap-5 flex-wrap">
          {isCategoriesLoading ? (
            <>
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-20" />
            </>
          ) : (
            categories.map((cat) => (
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
            ))
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1 text-sm shrink-0">
          <button
            onClick={() => {
              if (sort !== "newest") {
                setSort("newest");
                setArticles([]);
                setIsLoading(true);
              }
            }}
            className={
              sort === "newest"
                ? "text-stone-900 font-medium"
                : "text-stone-400 hover:text-stone-600"
            }>
            newest
          </button>

          <span className="text-stone-300">|</span>

          <button
            onClick={() => {
              if (sort !== "older") {
                setSort("older");
                setArticles([]);
                setIsLoading(true);
              }
            }}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {isLoading && articles.length === 0 ? (
          Array.from({ length: pageSize }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <Skeleton className="w-full aspect-4/3 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))
        ) : articles.length === 0 ? (
          <div className="col-span-full text-center py-20 text-stone-500">
            Tidak ada artikel ditemukan di kategori ini.
          </div>
        ) : (
          articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        )}

        {/* SKELETON UNTUK LOAD MORE */}
        {isLoading &&
          page > 1 &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`load-more-skeleton-${i}`}
              className="flex flex-col gap-4">
              <Skeleton className="w-full aspect-4/3 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
      </div>

      {/* Load More Button */}
      {hasMore && articles.length > 0 && (
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
      <div className="relative w-full aspect-4/3 bg-stone-200 overflow-hidden rounded-sm">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
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
