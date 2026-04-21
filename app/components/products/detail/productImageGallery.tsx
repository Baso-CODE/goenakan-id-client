"use client";

import { MediaItem } from "@/app/types/productDetail.type";
import { PlayCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductImageGalleryProps {
  media: MediaItem[];
  productName: string;
}

export function ProductImageGallery({
  media,
  productName,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Jika tidak ada media, jangan render apa-apa
  if (!media || media.length === 0) return null;

  const activeMedia = media[activeIndex];

  return (
    <div className="flex flex-col gap-3">
      {/* ── Main Media (Gambar atau Video) ── */}
      <div className="relative aspect-square w-full bg-stone-50 rounded-sm overflow-hidden border border-stone-100 flex items-center justify-center">
        {activeMedia.type === "video" ? (
          <video
            src={activeMedia.url}
            controls
            autoPlay
            muted
            loop
            className="w-full h-full object-contain"
          />
        ) : (
          <Image
            src={activeMedia.url}
            alt={`${productName} - media ${activeIndex + 1}`}
            fill
            className="object-contain p-6"
            sizes="(max-width: 768px) 100vw, 40vw"
            priority
          />
        )}
      </div>

      {/* ── Thumbnails ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {media.map((item, i) => (
          <button
            key={item.id || i}
            onClick={() => setActiveIndex(i)}
            className={`relative shrink-0 w-20 aspect-square rounded-sm overflow-hidden border transition-all duration-150 ${
              activeIndex === i
                ? "border-stone-800 ring-1 ring-stone-800"
                : "border-stone-200 hover:border-stone-400"
            }`}>
            {item.type === "video" ? (
              // Tampilan Thumbnail Video
              <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                <PlayCircle className="text-stone-500 w-8 h-8 z-10" />
              </div>
            ) : (
              // Tampilan Thumbnail Gambar
              <Image
                src={item.url}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                className="object-cover p-1 bg-stone-50"
                sizes="80px"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
