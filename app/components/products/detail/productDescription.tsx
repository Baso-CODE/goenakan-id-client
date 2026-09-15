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

  // 1. Hapus tag HTML sementara hanya untuk menghitung panjang karakter aslinya
  const plainText = description ? description.replace(/<[^>]+>/g, "") : "";
  const CHARACTER_LIMIT = 150;

  // Cek apakah teks asli (tanpa HTML) melebihi batas karakter
  const isLongDescription = plainText.length > CHARACTER_LIMIT;

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Specs (Berat & Dimensi) di Paling Atas */}
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

      {/* 2. Description dengan Rich Text HTML */}
      <div>
        <span className="font-semibold text-stone-900 block mb-2 text-sm">
          {isEn ? "Description" : "Deskripsi"}
        </span>

        <div className="relative">
          <div
            // ✨ DITAMBAHKAN KEMBALI: class prose-p dan prose-li untuk merapikan jarak yang mepet
            className={`text-sm text-stone-700 prose prose-sm max-w-none 
              prose-p:leading-relaxed prose-p:my-2 
              prose-ul:my-2 prose-li:my-1 
              prose-strong:font-semibold prose-strong:text-stone-900 ${
                !isExpanded && isLongDescription
                  ? "line-clamp-4 overflow-hidden"
                  : ""
              }`}
            // dangerouslySetInnerHTML akan mengubah string HTML menjadi elemen UI yang sesungguhnya
            dangerouslySetInnerHTML={{
              __html:
                description ||
                (isEn
                  ? "<p>No description available.</p>"
                  : "<p>Tidak ada deskripsi.</p>"),
            }}
          />

          {/* Efek gradien putih transparan di bawah agar terlihat elegan saat terpotong */}
          {!isExpanded && isLongDescription && (
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>

        {/* 3. Tombol Toggle */}
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
