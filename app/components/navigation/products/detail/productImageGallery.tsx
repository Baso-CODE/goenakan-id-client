"use client";

import { MediaItem } from "@/app/types/productDetail.type";
import { PlayCircle } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

interface ProductImageGalleryProps {
  media: MediaItem[];
  productName: string;
  customColor?: string;
  isColorPickerActive?: boolean;
}

export function ProductImageGallery({
  media,
  productName,
  customColor,
  isColorPickerActive,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!media || media.length === 0) return;
    // Auto-select the first image that is color customizable when media list changes
    const customIndex = media.findIndex((item) => item.isColorCustomizable);
    if (customIndex !== -1) {
      setActiveIndex(customIndex);
    } else {
      setActiveIndex(0);
    }
  }, [media]);

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
          isColorPickerActive && customColor && activeMedia.isColorCustomizable ? (
            <div className="relative w-full h-full">
              <Image
                src={activeMedia.url}
                alt={`${productName} - base`}
                fill
                className="object-contain p-6"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
              <div
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                  backgroundColor: customColor,
                  mixBlendMode: "multiply",
                  maskImage: `url(${activeMedia.url})`,
                  maskSize: "contain",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskImage: `url(${activeMedia.url})`,
                  WebkitMaskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  padding: "24px",
                }}
              />
            </div>
          ) : (
            <Image
              src={activeMedia.url}
              alt={`${productName} - media ${activeIndex + 1}`}
              fill
              className="object-contain p-6"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />
          )
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
              <div className="relative w-full h-full bg-stone-200 flex items-center justify-center">
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  preload="metadata"
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                  <PlayCircle className="text-white w-6 h-6 z-10 opacity-90" />
                </div>
              </div>
            ) : (
              isColorPickerActive && customColor && item.isColorCustomizable ? (
                <div className="relative w-full h-full aspect-square">
                  <Image
                    src={item.url}
                    alt={`${productName} thumbnail - base`}
                    fill
                    className="object-cover p-1 bg-stone-50"
                    sizes="80px"
                  />
                  <div
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{
                      backgroundColor: customColor,
                      mixBlendMode: "multiply",
                      maskImage: `url(${item.url})`,
                      maskSize: "cover",
                      maskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskImage: `url(${item.url})`,
                      WebkitMaskSize: "cover",
                      WebkitMaskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      padding: "4px",
                    }}
                  />
                </div>
              ) : (
                <Image
                  src={item.url}
                  alt={`${productName} thumbnail ${i + 1}`}
                  fill
                  className="object-cover p-1 bg-stone-50"
                  sizes="80px"
                />
              )
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
