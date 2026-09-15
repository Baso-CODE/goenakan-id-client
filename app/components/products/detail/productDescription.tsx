"use client";

import { useState } from "react";

interface ProductDescriptionProps {
  description: string;
  weight: string;
  dimensions: string;
  locale?: string;
}

export function ProductDescription({
  description,
  weight,
  dimensions,
  locale = "id",
}: ProductDescriptionProps) {
  const isEn = locale === "en";
  const [isExpanded, setIsExpanded] = useState(false);

  const specs = [
    { label: isEn ? "Weight" : "Berat", value: weight },
    { label: isEn ? "Dimensions" : "Dimensi", value: dimensions },
  ];

  // Batas karakter sebelum teks dipotong (bisa disesuaikan)
  const CHARACTER_LIMIT = 150;
  const isLongDescription = description && description.length > CHARACTER_LIMIT;

  const displayedDescription =
    !isExpanded && isLongDescription
      ? description.slice(0, CHARACTER_LIMIT) + "..."
      : description;

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Specs (Berat & Dimensi) dipindah ke Paling Atas */}
      <div className="flex flex-col gap-2 pb-2 border-b border-stone-100">
        {specs.map((spec) => (
          <div key={spec.label} className="flex gap-2 text-sm">
            <span className="text-stone-500 w-24 shrink-0 font-medium">
              {spec.label}:
            </span>
            <span className="text-stone-700">{spec.value || "-"}</span>
          </div>
        ))}
      </div>

      {/* 2. Description berada di bawah Specs dengan Batasan Karakter */}
      <div>
        <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
          <span className="font-semibold text-stone-900 block mb-1">
            {isEn ? "Description" : "Deskripsi"}
          </span>
          {displayedDescription ||
            (isEn ? "No description available." : "Tidak ada deskripsi.")}
        </p>

        {/* 3. Tombol Toggle untuk Membatasi / Menampilkan Semua */}
        {isLongDescription && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-xs text-stone-500 hover:text-stone-800 transition-colors font-medium flex items-center gap-1 cursor-pointer">
            {isEn
              ? isExpanded
                ? "show less"
                : "more information"
              : isExpanded
                ? "sembunyikan"
                : "informasi selengkapnya"}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
