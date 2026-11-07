"use client";

import { Article } from "@/app/types/articles/articleList.type";
import { apiUrl } from "@/app/utils/ApiUrl";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

interface ArticleListProps {
  categories?: string[];
  pageSize?: number;
}

const PAGE_SIZE = 6;

// Ganti warna ini sekali saja untuk seluruh tombol pagination.
const PAGINATION_ACCENT = "#b5956a";

type SortOrder = "newest" | "older";
type CategoryItem = { id: string; name_id: string; name_en: string | null };
type PageItem = number | "ellipsis-left" | "ellipsis-right";

const stripHtml = (html: string) => {
  if (typeof document === "undefined") return html.replace(/<[^>]+>/g, "");
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

function getPageNumbers(current: number, total: number): PageItem[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const visible = new Set<number>([1, 2, total - 1, total, current]);

  // Tampilkan halaman awal, akhir, dan halaman yang berdekatan dengan halaman aktif.
  if (current <= 3) [2, 3].forEach((n) => visible.add(n));
  else if (current >= total - 2)
    [total - 2, total - 1].forEach((n) => visible.add(n));
  else {
    visible.add(current - 1);
    visible.add(current + 1);
  }

  const sorted = [...visible]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);
  const result: PageItem[] = [];
  sorted.forEach((number, index) => {
    const previous = sorted[index - 1];
    if (previous !== undefined && number - previous > 1) {
      if (number - previous === 2) result.push(previous + 1);
      else result.push(index === 1 ? "ellipsis-left" : "ellipsis-right");
    }
    result.push(number);
  });
  return result;
}

export function ArticleList({ pageSize = PAGE_SIZE }: ArticleListProps) {
  const locale = useLocale();
  const isEnglish = locale === "en";
  const allPostsText = isEnglish ? "All posts" : "Semua Postingan";
  const newestText = isEnglish ? "newest" : "terbaru";
  const olderText = isEnglish ? "older" : "terlama";

  // Simpan ID nama kategori (Indonesia) sebagai parameter API; label boleh diterjemahkan.
  const [categoryList, setCategoryList] = useState<CategoryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [sort, setSort] = useState<SortOrder>("newest");
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const loadCategories = async () => {
      setIsCategoriesLoading(true);
      try {
        const res = await fetch(`${apiUrl}/article-categories/list`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch article categories");
        const json = await res.json();
        const list: CategoryItem[] = Array.isArray(json)
          ? json
          : (json.data ?? []);
        setCategoryList(list);
      } catch (err) {
        if (!controller.signal.aborted)
          console.error("Error fetching categories:", err);
      } finally {
        if (!controller.signal.aborted) setIsCategoriesLoading(false);
      }
    };
    void loadCategories();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const loadArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: String(page),
          take: String(pageSize),
          sort,
        });
        if (activeCategory) params.set("categoryName", activeCategory);

        const res = await fetch(
          `${apiUrl}/articles/list?${params.toString()}`,
          {
            signal: controller.signal,
            cache: "no-store",
          },
        );
        if (!res.ok)
          throw new Error(`Failed to fetch articles (${res.status})`);
        const json = await res.json();
        const items: any[] = Array.isArray(json.data) ? json.data : [];

        const mapped: Article[] = items.map((item: any) => {
          const title =
            isEnglish && item.title_en ? item.title_en : item.title_id;
          const content =
            isEnglish && item.content_en ? item.content_en : item.content_id;
          const category =
            isEnglish && item.category?.name_en
              ? item.category.name_en
              : item.category?.name_id || "Uncategorized";
          const plainText = stripHtml(content || "");
          return {
            id: item.id,
            title,
            excerpt:
              plainText.length > 100
                ? `${plainText.substring(0, 100)}...`
                : plainText,
            image:
              item.coverImage || "/images/articles/article-placeholder.jpg",
            category,
            date: new Date(
              item.publishedAt || item.createdAt,
            ).toLocaleDateString(isEnglish ? "en-US" : "id-ID", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
            href: `/article/${item.slug || item.id}`,
          };
        });

        // API harus mengembalikan totalPages atau total; hasNext saja tidak
        // cukup untuk menampilkan halaman terakhir (misal 95, 96).
        const meta = json.meta ?? {};
        const reportedPages = Number(meta.totalPages ?? meta.lastPage);
        const reportedTotal = Number(meta.total ?? meta.totalItems);
        const derivedPages =
          Number.isFinite(reportedPages) && reportedPages >= 0
            ? reportedPages
            : Number.isFinite(reportedTotal) && reportedTotal >= 0
              ? Math.ceil(reportedTotal / pageSize)
              : null;

        if (!controller.signal.aborted) {
          setArticles(mapped);
          // Fallback saat server belum mengirim total: navigasi hanya tahu
          // satu halaman berikutnya dari hasNext, bukan jumlah akhir sebenarnya.
          setTotalPages(
            Math.max(1, derivedPages ?? (meta.hasNext ? page + 1 : page)),
          );
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Error fetching articles:", err);
          setArticles([]);
          setError(
            isEnglish
              ? "Unable to load articles. Please try again."
              : "Gagal memuat artikel. Silakan coba lagi.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };
    void loadArticles();
    return () => controller.abort();
  }, [activeCategory, isEnglish, page, pageSize, sort]);

  const pages = useMemo(
    () => getPageNumbers(page, totalPages),
    [page, totalPages],
  );

  const changePage = (newPage: number) => {
    if (isLoading || newPage < 1 || newPage > totalPages || newPage === page)
      return;
    setArticles([]);
    setPage(newPage);
  };

  const changeCategory = (name: string) => {
    if (name === activeCategory) return;
    setArticles([]);
    setPage(1);
    setActiveCategory(name);
  };

  const changeSort = (newSort: SortOrder) => {
    if (newSort === sort) return;
    setArticles([]);
    setPage(1);
    setSort(newSort);
  };

  const pageButtonStyle = (active = false) =>
    `inline-flex h-11 min-w-11 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition-colors ` +
    (active
      ? "border-[var(--pagination-accent)] bg-[var(--pagination-accent)] text-white shadow-sm"
      : "border-stone-200 bg-white text-stone-700 hover:border-[var(--pagination-accent)] hover:text-[var(--pagination-accent)]");

  return (
    <section className="w-full container py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-stone-200 pb-3 gap-4">
        <div className="w-full md:w-[75%] lg:w-[85%] overflow-hidden">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex items-center gap-2 pb-2">
              {isCategoriesLoading ? (
                <>
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-32 rounded-full" />
                  <Skeleton className="h-8 w-28 rounded-full" />
                  <Skeleton className="h-8 w-20 rounded-full" />
                </>
              ) : (
                <>
                  <Badge
                    onClick={() => changeCategory("")}
                    variant={!activeCategory ? "default" : "outline"}
                    className={`cursor-pointer px-4 py-2 rounded-full text-xs font-medium transition-colors ${!activeCategory ? "bg-[#b5956a] text-white hover:bg-[#a07d55]" : "border-stone-300 text-stone-600 hover:bg-stone-100"}`}>
                    {allPostsText}
                  </Badge>
                  {categoryList.map((cat) => (
                    <Badge
                      key={cat.id}
                      onClick={() => changeCategory(cat.name_id)}
                      variant={
                        activeCategory === cat.name_id ? "default" : "outline"
                      }
                      className={`cursor-pointer px-4 py-2 rounded-full text-xs font-medium transition-colors ${activeCategory === cat.name_id ? "bg-[#b5956a] text-white hover:bg-[#a07d55]" : "border-stone-300 text-stone-600 hover:bg-stone-100"}`}>
                      {isEnglish && cat.name_en ? cat.name_en : cat.name_id}
                    </Badge>
                  ))}
                </>
              )}
            </div>
            <ScrollBar
              orientation="horizontal"
              className="invisible hover:visible"
            />
          </ScrollArea>
        </div>
        <div className="flex items-center gap-2 text-sm shrink-0">
          <button
            type="button"
            onClick={() => changeSort("newest")}
            className={
              sort === "newest"
                ? "text-stone-900 font-medium"
                : "text-stone-400 hover:text-stone-600"
            }>
            {newestText}
          </button>
          <span className="text-stone-300">|</span>
          <button
            type="button"
            onClick={() => changeSort("older")}
            className={
              sort === "older"
                ? "text-stone-900 font-medium"
                : "text-stone-400 hover:text-stone-600"
            }>
            {olderText}
          </button>
        </div>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"
        aria-busy={isLoading}>
        {isLoading ? (
          Array.from({ length: pageSize }).map((_, i) => (
            <div key={`article-skeleton-${i}`} className="flex flex-col gap-4">
              <Skeleton className="w-full aspect-4/3 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))
        ) : error ? (
          <div
            className="col-span-full text-center py-20 text-red-600"
            role="alert">
            {error}
          </div>
        ) : articles.length === 0 ? (
          <div className="col-span-full text-center py-20 text-stone-500">
            {isEnglish
              ? "No articles found in this category."
              : "Tidak ada artikel ditemukan di kategori ini."}
          </div>
        ) : (
          articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        )}
      </div>

      {!isLoading && !error && articles.length > 0 && totalPages > 1 && (
        <nav
          aria-label={isEnglish ? "Article pages" : "Halaman artikel"}
          className="mt-12 flex flex-wrap items-center justify-center gap-2"
          style={
            { "--pagination-accent": PAGINATION_ACCENT } as React.CSSProperties
          }>
          {page > 1 && (
            <button
              type="button"
              onClick={() => changePage(page - 1)}
              className={pageButtonStyle()}
              aria-label={isEnglish ? "Previous page" : "Halaman sebelumnya"}>
              «{" "}
              <span className="ml-1 hidden sm:inline">
                {isEnglish ? "Previous" : "Sebelumnya"}
              </span>
            </button>
          )}
          {pages.map((item) =>
            typeof item === "number" ? (
              <button
                key={`page-${item}`}
                type="button"
                onClick={() => changePage(item)}
                aria-label={`${isEnglish ? "Page" : "Halaman"} ${item}`}
                aria-current={item === page ? "page" : undefined}
                className={pageButtonStyle(item === page)}>
                {item}
              </button>
            ) : (
              <span
                key={item}
                aria-hidden="true"
                className="flex h-11 min-w-7 items-center justify-center text-stone-500">
                ...
              </span>
            ),
          )}
          {page < totalPages && (
            <button
              type="button"
              onClick={() => changePage(page + 1)}
              className={pageButtonStyle()}
              aria-label={isEnglish ? "Next page" : "Halaman berikutnya"}>
              {isEnglish ? "Next" : "Berikutnya"} »
            </button>
          )}
        </nav>
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
