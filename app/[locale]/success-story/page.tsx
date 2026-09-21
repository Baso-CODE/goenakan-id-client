"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

import { getPublicSuccessStoriesAPI } from "@/app/api/sucess-story/getPublicSuccessStory.api";
import { LoadMoreButton } from "@/app/components/products/Loadmorebutton";
import {
  SuccessStoryCard,
  SuccessStoryData,
} from "@/app/components/success-story/successStoryCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function SuccessStoryPage() {
  const locale = useLocale();

  // State untuk Loading Awal
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // State untuk Data Cerita dan Pagination
  const [stories, setStories] = useState<SuccessStoryData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 1. FETCH PERTAMA KALI (INITIAL LOAD)
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsInitialLoading(true);
      try {
        const res = await getPublicSuccessStoriesAPI(locale, 1);

        setStories(res.data || []);
        setHasMore(res.meta?.hasNext || false);
        setPage(1);
      } catch (error) {
        console.error("Error fetching initial success stories:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchInitialData();
  }, [locale]);

  // 2. FUNGSI LOAD MORE
  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      const res = await getPublicSuccessStoriesAPI(locale, nextPage);

      // Gabungkan data lama (...prev) dengan data baru (...res.data)
      setStories((prev) => [...prev, ...(res.data || [])]);
      setHasMore(res.meta?.hasNext || false);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more stories:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="container max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">
            {locale === "en" ? "Success Stories" : "Kisah Sukses"}
          </h1>
          <p className="text-stone-500 max-w-2xl mx-auto">
            {locale === "en"
              ? "Discover how our clients achieve their goals with our solutions."
              : "Temukan bagaimana klien kami mencapai tujuan mereka dengan solusi kami."}
          </p>
        </div>

        {isInitialLoading ? (
          // Tampilan kerangka (Skeleton) saat memuat pertama kali
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-72 w-full rounded-xl" />
            <Skeleton className="h-72 w-full rounded-xl" />
            <Skeleton className="h-72 w-full rounded-xl" />
          </div>
        ) : (
          <div className="space-y-10">
            {/* Grid Cerita */}
            {stories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => (
                  <SuccessStoryCard key={story.id} story={story} />
                ))}
              </div>
            ) : (
              <p className="text-center text-stone-500 italic py-10">
                {locale === "en"
                  ? "No success stories found."
                  : "Belum ada kisah sukses."}
              </p>
            )}

            {/* Tombol Load More */}
            {hasMore && (
              <div className="mt-8">
                <LoadMoreButton
                  onClick={handleLoadMore}
                  isLoading={isLoadingMore}
                  hasMore={hasMore}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
