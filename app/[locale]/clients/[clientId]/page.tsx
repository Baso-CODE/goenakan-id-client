"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { LoadMoreButton } from "@/app/components/products/Loadmorebutton";

import { getClientSuccessStoriesAPI } from "@/app/api/sucess-story/getClientSuccessStories.api";
import {
  SuccessStoryCard,
  SuccessStoryData,
} from "@/app/components/success-story/successStoryCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientSuccessStoriesPage() {
  const locale = useLocale();
  const params = useParams();

  // Menangkap clientId dari URL (misalnya dari /client/12345)
  const clientId = params.clientId as string;

  // State untuk Data dan Loading
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [stories, setStories] = useState<SuccessStoryData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 1. FETCH PERTAMA KALI
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!clientId) return;
      setIsInitialLoading(true);

      try {
        const res = await getClientSuccessStoriesAPI(clientId, locale, 1);
        setStories(res.data || []);
        setHasMore(res.meta?.hasNext || false);
        setPage(1);
      } catch (error) {
        console.error("Error fetching client stories:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchInitialData();
  }, [clientId, locale]);

  // 2. FUNGSI LOAD MORE
  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      const res = await getClientSuccessStoriesAPI(clientId, locale, nextPage);
      setStories((prev) => [...prev, ...(res.data || [])]);
      setHasMore(res.meta?.hasNext || false);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more client stories:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Mengambil nama klien dari data pertama (jika ada) untuk ditampilkan di judul
  const clientNameDisplay =
    stories.length > 0 ? stories[0].clientName : "Client";

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="container max-w-6xl mx-auto px-4 md:px-6">
        {/* === HEADER === */}
        <div className="mb-10 text-center border-b border-stone-200 pb-8">
          <p className="text-stone-500 uppercase tracking-widest text-sm font-bold mb-2">
            {locale === "en" ? "Stories From" : "Cerita Dari"}
          </p>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-stone-900">
            {isInitialLoading ? (
              <Skeleton className="h-10 w-64 mx-auto" />
            ) : (
              clientNameDisplay
            )}
          </h1>
        </div>

        {/* === KONTEN === */}
        {isInitialLoading ? (
          // Skeleton Loading
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-72 w-full rounded-xl" />
            <Skeleton className="h-72 w-full rounded-xl" />
            <Skeleton className="h-72 w-full rounded-xl" />
          </div>
        ) : (
          <div className="space-y-10">
            {stories.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stories.map((story) => (
                    <SuccessStoryCard key={story.id} story={story} />
                  ))}
                </div>

                {/* Tombol Load More */}
                {hasMore && (
                  <LoadMoreButton
                    onClick={handleLoadMore}
                    isLoading={isLoadingMore}
                    hasMore={hasMore}
                  />
                )}
              </>
            ) : (
              // Tampilan jika Klien belum memiliki cerita
              <div className="text-center py-20 border border-dashed border-stone-300 rounded-lg bg-white">
                <p className="text-stone-500 italic">
                  {locale === "en"
                    ? "No stories found for this client yet."
                    : "Belum ada cerita untuk klien ini."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
