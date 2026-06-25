"use client";

import { MediaItem, MockupArea } from "@/app/types/productDetail.type";
import { Upload, Trash2, ImageIcon, Sparkles, RefreshCw, Check } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

interface ProductCustomizerProps {
  media: MediaItem[];
  productName: string;
  isMultiFace?: boolean;
  mockupFrontImageId?: string | null;
  mockupBackImageId?: string | null;
  onChange?: (customization: any) => void;
}

export function ProductCustomizer({
  media,
  productName,
  isMultiFace = false,
  mockupFrontImageId,
  mockupBackImageId,
  onChange,
}: ProductCustomizerProps) {
  const isImageCustomizable = (item: MediaItem) => {
    const hasAreas = !!(item.mockupAreas && item.mockupAreas.length > 0);
    if (!hasAreas) return false;

    if (mockupFrontImageId) {
      if (isMultiFace) {
        return item.id === mockupFrontImageId || (mockupBackImageId && item.id === mockupBackImageId);
      } else {
        return item.id === mockupFrontImageId;
      }
    }
    return true;
  };

  const customizableViews = media.filter(isImageCustomizable);

  const [activeIndex, setActiveIndex] = useState(() => {
    const initialCustomizableIndex = media.findIndex(isImageCustomizable);
    return initialCustomizableIndex !== -1 ? initialCustomizableIndex : 0;
  });

  // Simpan mapping dari area.id ke detail logo kustom: { image: base64, fileName: string, label: string }
  const [uploads, setUploads] = useState<Record<string, { image: string; fileName: string; label: string }>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Jika active index tidak valid, default ke media pertama
  const activeMedia = media[activeIndex] || media[0];

  // Efek samping untuk mengirimkan state customization ke parent component
  useEffect(() => {
    if (onChange) {
      if (Object.keys(uploads).length === 0) {
        onChange(null);
      } else {
        onChange({
          zones: uploads,
        });
      }
    }
  }, [uploads, onChange]);

  if (!media || media.length === 0) return null;

  const handleFileChange = (area: MockupArea, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar!");
      return;
    }

    // Limit 10MB untuk base64 agar aman
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran gambar terlalu besar! Maksimal 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setUploads((prev) => ({
        ...prev,
        [area.id]: {
          image: base64,
          fileName: file.name,
          label: area.label,
        },
      }));
      toast.success(`Logo untuk "${area.label}" berhasil diunggah!`);
    };
    reader.onerror = () => {
      toast.error("Gagal membaca file gambar.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveUpload = (areaId: string, label: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Cegah men-trigger klik pada box
    setUploads((prev) => {
      const copy = { ...prev };
      delete copy[areaId];
      return copy;
    });

    // Reset file input value
    if (fileInputRefs.current[areaId]) {
      fileInputRefs.current[areaId]!.value = "";
    }
    toast.info(`Logo untuk "${label}" dihapus.`);
  };

  const triggerUpload = (areaId: string) => {
    fileInputRefs.current[areaId]?.click();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Switcher Tab Utama (Front / Back / Customizable Views) ── */}
      {customizableViews.length > 1 && (
        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-md self-start">
          {customizableViews.map((item) => {
            const originalIndex = media.findIndex((m) => m.id === item.id);
            const isActive = activeIndex === originalIndex;
            return (
              <button
                key={item.id}
                onClick={() => setActiveIndex(originalIndex)}
                className={`px-4 py-1.5 rounded-sm text-xs font-semibold tracking-wider uppercase transition-all ${
                  isActive
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                {isMultiFace && item.id === mockupBackImageId
                  ? "Tampak Belakang"
                  : isMultiFace && item.id === mockupFrontImageId
                  ? "Tampak Depan"
                  : (item.mockupAreas?.[0]?.label.toLowerCase().includes("back") ||
                     item.url.toLowerCase().includes("back") ||
                     (item.mockupAreas && item.mockupAreas.some((a) => a.label.toLowerCase().includes("belakang"))))
                  ? "Tampak Belakang"
                  : "Tampak Depan"}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Area Preview Utama + Overlay Interaktif ── */}
      <div className="relative aspect-square w-full bg-stone-50 rounded-sm overflow-hidden border border-stone-200 flex items-center justify-center select-none">
        {activeMedia.type === "video" ? (
          <video
            src={activeMedia.url}
            controls
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="relative w-full h-full">
            {/* Gambar Produk Dasar */}
            <Image
              src={activeMedia.url}
              alt={`${productName} - view`}
              fill
              className="object-contain p-6"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />

            {/* Render Overlay Mockup Area Interaktif */}
            {isImageCustomizable(activeMedia) && activeMedia.mockupAreas?.map((area) => {
              const upload = uploads[area.id];
              return (
                <div
                  key={area.id}
                  style={{
                    left: `${area.x}%`,
                    top: `${area.y}%`,
                    width: `${area.width}%`,
                    height: `${area.height}%`,
                  }}
                  onClick={() => triggerUpload(area.id)}
                  className={`absolute group cursor-pointer border transition-all duration-300 flex items-center justify-center overflow-hidden rounded-sm ${
                    upload
                      ? "border-green-500/80 bg-white/10 backdrop-blur-[1px] hover:border-green-600 hover:bg-white/20"
                      : "border-dashed border-stone-400 hover:border-stone-800 hover:bg-stone-900/5 bg-white/20 backdrop-blur-[2px]"
                  }`}
                  title={`Klik untuk unggah logo ke area: ${area.label}`}
                >
                  {/* Input File Tersembunyi */}
                  <input
                    type="file"
                    ref={(el) => {
                      fileInputRefs.current[area.id] = el;
                    }}
                    onChange={(e) => handleFileChange(area, e)}
                    accept="image/*"
                    className="hidden"
                  />

                  {upload ? (
                    // Tampilan ketika gambar sudah diunggah
                    <div className="relative w-full h-full p-1 flex items-center justify-center">
                      <img
                        src={upload.image}
                        alt={area.label}
                        className="w-full h-full object-contain pointer-events-none"
                      />
                      {/* Badge Hijau Penanda Sukses */}
                      <span className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </span>
                      {/* Overlay Hover untuk Aksi */}
                      <div className="absolute inset-0 bg-stone-900/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-2 items-center justify-center text-white">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-green-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Area Kustom
                        </p>
                        <div className="flex gap-1.5 mt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerUpload(area.id);
                            }}
                            className="p-1.5 bg-white/20 hover:bg-white/35 rounded-sm transition-colors"
                            title="Ganti Logo"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-white" />
                          </button>
                          <button
                            onClick={(e) => handleRemoveUpload(area.id, area.label, e)}
                            className="p-1.5 bg-red-600/80 hover:bg-red-600 rounded-sm transition-colors"
                            title="Hapus Logo"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Tampilan Default (Belum Unggah Logo)
                    <div className="flex flex-col items-center justify-center p-2 text-center text-stone-600 group-hover:text-stone-900 transition-colors">
                      <Upload className="w-5 h-5 mb-1 stroke-[1.5]" />
                      <span className="text-[10px] font-bold uppercase tracking-widest leading-none block">
                        {area.label}
                      </span>
                      {area.description && (
                        <span className="text-[8px] text-stone-400 mt-0.5 max-w-full truncate block">
                          {area.description}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Status Kustomisasi (Panel Bawah) ── */}
      <div className="bg-stone-50 border border-stone-200/80 p-4 rounded-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-800 mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#C4A48E]" /> Status Kustomisasi Logo
        </h3>
        {isImageCustomizable(activeMedia) && activeMedia.mockupAreas && activeMedia.mockupAreas.length > 0 ? (
          <div className="flex flex-col gap-2">
            {activeMedia.mockupAreas.map((area) => {
              const upload = uploads[area.id];
              return (
                <div
                  key={area.id}
                  onClick={() => triggerUpload(area.id)}
                  className="flex items-center justify-between p-2.5 bg-white border border-stone-200 rounded-sm hover:border-stone-400 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-sm bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden shrink-0">
                      {upload ? (
                        <img src={upload.image} alt={area.label} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-stone-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-stone-800 leading-tight">
                        {area.label}
                      </p>
                      <p className="text-[10px] text-stone-400 truncate max-w-xs mt-0.5">
                        {upload ? upload.fileName : area.description || "Belum ada logo diunggah"}
                      </p>
                    </div>
                  </div>
                  {upload ? (
                    <button
                      onClick={(e) => handleRemoveUpload(area.id, area.label, e)}
                      className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-[#C4A48E] uppercase tracking-wider">
                      Unggah
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-stone-400 italic">
            Gambar ini tidak mendukung kustomisasi logo. Gunakan switcher di atas untuk memilih tampak depan/belakang yang bisa dikustom.
          </p>
        )}
      </div>

      {/* ── Gallery Thumbnails ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {media.map((item, i) => {
          const isCustomizable = isImageCustomizable(item);
          return (
            <button
              key={item.id || i}
              onClick={() => setActiveIndex(i)}
              className={`relative shrink-0 w-20 aspect-square rounded-sm overflow-hidden border transition-all duration-150 ${
                activeIndex === i
                  ? "border-stone-800 ring-1 ring-stone-800"
                  : "border-stone-200 hover:border-stone-400"
              }`}
            >
              {item.type === "video" ? (
                <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                  <span className="text-[9px] font-semibold text-stone-600">Video</span>
                </div>
              ) : (
                <>
                  <Image
                    src={item.url}
                    alt={`${productName} thumbnail ${i + 1}`}
                    fill
                    className="object-cover p-1 bg-stone-50"
                    sizes="80px"
                  />
                  {isCustomizable && (
                    <span className="absolute bottom-0 inset-x-0 bg-stone-900/80 text-[8px] text-white font-bold uppercase py-0.5 text-center leading-none tracking-widest">
                      Kustom
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
