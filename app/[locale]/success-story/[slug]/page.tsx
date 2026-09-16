"use client";

import { getDetailSuccessStoryAPI } from "@/app/api/sucess-story/getDetailSuccessStory.api";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessStoryDetail() {
  const locale = useLocale();
  const params = useParams();
  const slug = params.slug as string;

  const [story, setStory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isVideo = (url?: string) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg)$/i) !== null;
  };

  useEffect(() => {
    const fetchDetail = async () => {
      if (!slug) return;
      setIsLoading(true);
      const data = await getDetailSuccessStoryAPI(slug, locale);
      setStory(data);
      setIsLoading(false);
    };

    fetchDetail();
  }, [slug, locale]);

  // Tampilan saat data sedang dimuat
  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-12 space-y-8">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-100 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Tampilan jika data tidak ditemukan atau URL salah
  if (!story) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-stone-500">
        Cerita tidak ditemukan.
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white py-16 text-stone-800">
      <div className="container max-w-5xl mx-auto px-4 md:px-6">
        {/* === HEADER === */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-stone-200 pb-6">
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight md:max-w-2xl">
            {story.title}
          </h1>
          <p className="text-stone-500 text-sm md:text-base font-medium tracking-wide uppercase">
            A Success Story from{" "}
            <span className="font-bold text-stone-800">{story.clientName}</span>
          </p>
        </div>

        {/* === HERO IMAGE === */}
        {story.heroImageUrl && (
          <div className="relative w-full aspect-21/9 bg-stone-100 rounded-sm overflow-hidden mb-12 shadow-sm">
            <Image
              src={story.heroImageUrl}
              alt={story.title}
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
          </div>
        )}

        {/* === SIDE CONTENT & MEDIA GRID === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
          {/* Sisi Kiri: Media 1 & Media 2 ("Video if any" pada desain) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Media 1 */}
            {story.media1Url ? (
              <div className="relative aspect-3/4 bg-stone-200 rounded-sm overflow-hidden">
                {isVideo(story.media1Url) ? (
                  <video
                    src={story.media1Url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Image
                    src={story.media1Url}
                    alt="Media 1"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            ) : (
              <div className="aspect-3/4 bg-stone-100 flex items-center justify-center rounded-sm">
                <span className="text-stone-400 text-sm">No Media</span>
              </div>
            )}

            {/* Media 2 */}
            {story.media2Url ? (
              <div className="relative aspect-3/4 bg-stone-200 rounded-sm overflow-hidden">
                {isVideo(story.media2Url) ? (
                  <video
                    src={story.media2Url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Image
                    src={story.media2Url}
                    alt="Media 2"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            ) : (
              <div className="aspect-3/4 bg-stone-100 flex items-center justify-center rounded-sm">
                <span className="text-stone-400 text-sm">No Media</span>
              </div>
            )}
          </div>

          {/* Sisi Kanan: Side HTML Content */}
          {/* Note: Kita tambahkan styling CSS untuk tag p, h1, h2 yang ada di dalam HTML */}
          <div
            className="flex flex-col justify-center [&>h2]:text-3xl [&>h2]:font-serif [&>h2]:mb-4 [&>p]:text-stone-600 [&>p]:mb-4 [&>p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: story.sideContentHtml || "" }}
          />
        </div>

        {/* === MAIN CONTENT === */}
        {story.mainContentHtml && (
          <div
            className="max-w-4xl border-t border-stone-200 pt-12 [&>h1]:text-4xl [&>h1]:font-serif [&>h1]:mb-6 [&>h2]:text-3xl [&>h2]:font-serif [&>h2]:mb-4 [&>p]:text-stone-600 [&>p]:mb-6 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:ml-5 [&>ul]:mb-6 [&>li]:text-stone-600"
            dangerouslySetInnerHTML={{ __html: story.mainContentHtml }}
          />
        )}

        {/* === TEMPAT UNTUK "ANOTHER STORY" NANTI === */}
        <div className="mt-20 border-t border-stone-200 pt-12">
          {/* Nanti kita pasang komponen <AnotherStory /> di sini */}
        </div>
      </div>
    </article>
  );
}
