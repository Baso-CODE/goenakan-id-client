"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image */}
      <div className="relative aspect-square w-full bg-stone-50 rounded-sm overflow-hidden border border-stone-100">
        <Image
          src={images[activeIndex]}
          alt={`${productName} - gambar ${activeIndex + 1}`}
          fill
          className="object-contain p-6"
          sizes="(max-width: 768px) 100vw, 40vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2">
        {images.slice(1).map((src, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i + 1)}
            className={`relative w-20 aspect-square rounded-sm overflow-hidden border transition-all duration-150 ${
              activeIndex === i + 1
                ? "border-stone-800 ring-1 ring-stone-800"
                : "border-stone-200 hover:border-stone-400"
            }`}>
            <Image
              src={src}
              alt={`${productName} thumbnail ${i + 1}`}
              fill
              className="object-contain p-2 bg-stone-50"
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
