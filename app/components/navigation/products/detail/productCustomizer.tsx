"use client";

import { MediaItem, MockupArea } from "@/app/types/productDetail.type";
import { Upload, Trash2, ImageIcon, Sparkles, RefreshCw, Check, Plus } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect, useMemo } from "react";
import { toast } from "sonner";

export interface LogoItem {
  id: string;
  image: string;
  fileName: string;
  logoCount?: number;
  xOffset?: number;
  yOffset?: number;
  scale?: number;
  rotate?: number;
  aspectRatio?: number;
  opacity?: number;
}

interface ProductCustomizerProps {
  media: MediaItem[];
  productName: string;
  isMultiFace?: boolean;
  mockupFrontImageId?: string | null;
  mockupBackImageId?: string | null;
  selectedAttributeValueIds?: string[];
  onChange?: (customization: any) => void;
  attributeValues?: any[];
}

export function ProductCustomizer({
  media,
  productName,
  isMultiFace = false,
  mockupFrontImageId,
  mockupBackImageId,
  selectedAttributeValueIds = [],
  onChange,
  attributeValues = [],
}: ProductCustomizerProps) {
  const isImageCustomizable = (item: MediaItem) => {
    return !!(item.mockupAreas && item.mockupAreas.length > 0);
  };

  const getSidePriceModifier = (item: MediaItem) => {
    if (!item.attributeValueId || !attributeValues) return 0;
    const av = attributeValues.find((av: any) => av.attributeValueId === item.attributeValueId);
    return av ? (av.priceModifier ?? 0) : 0;
  };

  const customizableViews = useMemo(() => {
    let views = media.filter(isImageCustomizable);
    if (selectedAttributeValueIds && selectedAttributeValueIds.length > 0) {
      const matchingViews = views.filter(
        (item) => item.attributeValueId && selectedAttributeValueIds.includes(item.attributeValueId)
      );
      if (matchingViews.length > 0) {
        views = matchingViews;
      }
    }
    return views;
  }, [media, selectedAttributeValueIds]);

  const [activeIndex, setActiveIndex] = useState(() => {
    const initialCustomizableIndex = media.findIndex((m) => m.id === customizableViews[0]?.id);
    return initialCustomizableIndex !== -1 ? initialCustomizableIndex : 0;
  });

  useEffect(() => {
    if (customizableViews.length > 0) {
      const currentActiveMedia = media[activeIndex];
      const newIndex = customizableViews.findIndex((item: MediaItem) => item.id === currentActiveMedia?.id);
      if (newIndex === -1) {
        const fallbackIndex = media.findIndex((m) => m.id === customizableViews[0].id);
        setActiveIndex(fallbackIndex !== -1 ? fallbackIndex : 0);
      }
    }
  }, [customizableViews, media, activeIndex]);

  // Simpan mapping dari area.id ke array LogoItem: { id, image: base64, fileName, logoCount, xOffset, yOffset, scale, rotate, aspectRatio, opacity }
  const [uploads, setUploads] = useState<Record<string, LogoItem[]>>({});

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Simpan id logo yang aktif dipilih untuk diedit di panel bawah
  const [activeLogoId, setActiveLogoId] = useState<string | null>(null);

  // Jika active index tidak valid, default ke media pertama
  const activeMedia = media[activeIndex] || media[0];

  // Synchronize uploads state across different mockup media items when variants change
  useEffect(() => {
    if (!activeMedia || !activeMedia.mockupAreas) return;
    
    setUploads((prev) => {
      let hasChanged = false;
      const updated = { ...prev };
      
      activeMedia.mockupAreas?.forEach((area) => {
        // If this new areaId has no uploads yet, see if another areaId with the same label has uploads
        if (!updated[area.id] || updated[area.id].length === 0) {
          const normalizedLabel = area.label?.toLowerCase().trim();
          if (normalizedLabel) {
            // Find another areaId in prev that matches the same label
            const matchingKey = Object.keys(prev).find((key) => {
              if (key === area.id) return false;
              const otherArea = media.flatMap((m) => m.mockupAreas || []).find((a) => a.id === key);
              return otherArea?.label?.toLowerCase().trim() === normalizedLabel;
            });
            
            if (matchingKey && prev[matchingKey] && prev[matchingKey].length > 0) {
              const oldArea = media.flatMap((m) => m.mockupAreas || []).find((a) => a.id === matchingKey);
              if (oldArea) {
                updated[area.id] = prev[matchingKey].map((logo) => {
                  const xVal = logo.xOffset ?? 0;
                  const yVal = logo.yOffset ?? 0;
                  const sVal = logo.scale ?? 0;

                  const relX = (xVal - oldArea.x) / oldArea.width;
                  const relY = (yVal - oldArea.y) / oldArea.height;
                  const relScale = sVal / oldArea.width;
                  
                  const newScale = relScale * area.width;
                  const newX = area.x + relX * area.width;
                  const newY = area.y + relY * area.height;
                  
                  return {
                    ...logo,
                    xOffset: newX,
                    yOffset: newY,
                    scale: newScale,
                  };
                });
                hasChanged = true;
              }
            }
          }
        }
      });
      
      return hasChanged ? updated : prev;
    });
  }, [activeMedia, media]);

  const [activeAreaId, setActiveAreaId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleLogoPointerDown = (
    areaId: string,
    logoId: string,
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    setActiveAreaId(areaId);
    setActiveLogoId(logoId);
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    setIsDragging(true);

    const logoRect = el.getBoundingClientRect();
    setDragStart({
      x: e.clientX - logoRect.left,
      y: e.clientY - logoRect.top,
    });
  };

  const handleLogoPointerMove = (
    areaId: string,
    logoId: string,
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!isDragging) return;
    const el = e.currentTarget;
    const parentEl = el.parentElement;
    if (!parentEl) return;

    const parentRect = parentEl.getBoundingClientRect();

    let newX = e.clientX - parentRect.left - dragStart.x;
    let newY = e.clientY - parentRect.top - dragStart.y;

    // Default bounds: full canvas
    let minX = 0, minY = 0;
    let maxX = parentRect.width - el.clientWidth;
    let maxY = parentRect.height - el.clientHeight;

    const dragArea = activeMedia.mockupAreas?.find((a) => a.id === areaId);
    if (dragArea) {
      const aLeft   = (dragArea.x / 100) * parentRect.width;
      const aTop    = (dragArea.y / 100) * parentRect.height;
      const aRight  = ((dragArea.x + dragArea.width)  / 100) * parentRect.width  - el.clientWidth;
      const aBottom = ((dragArea.y + dragArea.height) / 100) * parentRect.height - el.clientHeight;
      minX = Math.max(minX, aLeft);
      minY = Math.max(minY, aTop);
      maxX = Math.min(maxX, Math.max(aLeft, aRight));
      maxY = Math.min(maxY, Math.max(aTop,  aBottom));
    }

    newX = Math.max(minX, Math.min(newX, maxX));
    newY = Math.max(minY, Math.min(newY, maxY));

    const pctX = (newX / parentRect.width) * 100;
    const pctY = (newY / parentRect.height) * 100;

    setUploads((prev) => {
      const list = prev[areaId] || [];
      const updatedList = list.map((logo) =>
        logo.id === logoId ? { ...logo, xOffset: pctX, yOffset: pctY } : logo
      );
      return {
        ...prev,
        [areaId]: updatedList,
      };
    });
  };

  const handleLogoPointerUp = (
    _areaId: string,
    _logoId: string,
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const getMaxScale = (area: MockupArea, logo: { aspectRatio?: number }) => {
    const aspect = logo.aspectRatio || 1.0;
    return Math.min(area.width, area.height * aspect);
  };

  const updateTransform = (areaId: string, logoId: string, key: "scale" | "rotate" | "xOffset" | "yOffset" | "opacity", value: number) => {
    setUploads((prev) => {
      const list = prev[areaId] || [];
      const updatedList = list.map((item) => {
        if (item.id === logoId) {
          let val = value;
          const area = activeMedia.mockupAreas?.find((a) => a.id === areaId);
          if (area) {
            if (key === "scale") {
              const maxS = getMaxScale(area, item);
              val = Math.min(maxS, Math.max(5, value));
              
              // Shift x & y jika melebihi area bounds saat diresize
              const aspect = item.aspectRatio || 1.0;
              const maxX = area.x + area.width - val;
              const maxY = area.y + area.height - (val / aspect);
              
              return {
                ...item,
                scale: val,
                xOffset: Math.max(area.x, Math.min(item.xOffset || area.x, maxX)),
                yOffset: Math.max(area.y, Math.min(item.yOffset || area.y, maxY)),
              };
            }
            if (key === "xOffset") {
              const maxX = area.x + area.width - (item.scale || 10);
              val = Math.max(area.x, Math.min(value, maxX));
            }
            if (key === "yOffset") {
              const aspect = item.aspectRatio || 1.0;
              const maxY = area.y + area.height - ((item.scale || 10) / aspect);
              val = Math.max(area.y, Math.min(value, maxY));
            }
          }
          return {
            ...item,
            [key]: val,
          };
        }
        return item;
      });
      return {
        ...prev,
        [areaId]: updatedList,
      };
    });
  };

  const alignLogo = (
    areaId: string,
    logoId: string,
    alignment: "left" | "center-horiz" | "right" | "top" | "center-vert" | "bottom"
  ) => {
    const area = activeMedia.mockupAreas?.find((a) => a.id === areaId);
    if (!area) return;

    setUploads((prev) => {
      const list = prev[areaId] || [];
      const updatedList = list.map((item) => {
        if (item.id === logoId) {
          let newX = item.xOffset ?? area.x;
          let newY = item.yOffset ?? area.y;
          const scale = item.scale ?? 10;
          const aspect = item.aspectRatio ?? 1.0;
          const logoHeight = scale / aspect;

          if (alignment === "left") {
            newX = area.x;
          } else if (alignment === "center-horiz") {
            newX = area.x + (area.width - scale) / 2;
          } else if (alignment === "right") {
            newX = area.x + area.width - scale;
          } else if (alignment === "top") {
            newY = area.y;
          } else if (alignment === "center-vert") {
            newY = area.y + (area.height - logoHeight) / 2;
          } else if (alignment === "bottom") {
            newY = area.y + area.height - logoHeight;
          }

          return {
            ...item,
            xOffset: newX,
            yOffset: newY,
          };
        }
        return item;
      });
      return {
        ...prev,
        [areaId]: updatedList,
      };
    });
  };

  // Efek samping untuk mengirimkan state customization ke parent component
  useEffect(() => {
    if (onChange) {
      const activeUploads = Object.entries(uploads).filter(([_, list]) => list.length > 0);
      if (activeUploads.length === 0) {
        onChange(null);
      } else {
        const zonesObj: Record<string, { label: string; logos: LogoItem[]; logoCount: number; printPositionValueId?: string | null }> = {};
        for (const [areaId, list] of activeUploads) {
          const area = activeMedia.mockupAreas?.find((a) => a.id === areaId);
          const label = activeMedia.mockupSideName || area?.label || "Kustom";
          const totalCount = list.reduce((sum, item) => sum + (item.logoCount || 1), 0);
          zonesObj[areaId] = {
            label,
            logos: list,
            logoCount: totalCount,
            printPositionValueId: activeMedia.printPositionValueId,
          };
        }
        onChange({
          zones: zonesObj,
        });
      }
    }
  }, [uploads, onChange, activeMedia]);

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
      const img = new window.Image();
      img.onload = () => {
        const ar = img.naturalWidth / img.naturalHeight;
        const defaultSize = Math.round(area.width * 0.7);
        const maxS = getMaxScale(area, { aspectRatio: ar });
        const finalSize = Math.min(defaultSize, maxS);
        
        const initX = area.x + (area.width - finalSize) / 2;
        const initY = area.y + (area.height - (finalSize / ar)) / 2;

        const newLogo: LogoItem = {
          id: Math.random().toString(36).substring(2, 9),
          image: base64,
          fileName: file.name,
          logoCount: 1, // Inisialisasi jumlah logo ke 1
          xOffset: initX,
          yOffset: initY,
          scale: finalSize,
          rotate: 0,
          aspectRatio: ar,
          opacity: 100,
        };
        setUploads((prev) => {
          const existing = prev[area.id] || [];
          return {
            ...prev,
            [area.id]: [...existing, newLogo],
          };
        });
        setActiveLogoId(newLogo.id);
        toast.success(`Logo untuk "${activeMedia.mockupSideName || area.label}" berhasil diunggah!`);
      };
      img.src = base64;
    };
    reader.onerror = () => {
      toast.error("Gagal membaca file gambar.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = (areaId: string, logoId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Cegah men-trigger klik pada box
    setUploads((prev) => {
      const list = prev[areaId] || [];
      const filtered = list.filter((item) => item.id !== logoId);
      const copy = { ...prev };
      if (filtered.length === 0) {
        delete copy[areaId];
      } else {
        copy[areaId] = filtered;
      }
      return copy;
    });

    if (activeLogoId === logoId) {
      setActiveLogoId(null);
    }
    toast.info("Logo dihapus.");

    // Reset file input value
    if (fileInputRefs.current[areaId]) {
      fileInputRefs.current[areaId]!.value = "";
    }
  };

  const triggerUpload = (areaId: string) => {
    fileInputRefs.current[areaId]?.click();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Switcher Tab Utama (Front / Back / Customizable Views) ── */}
      {customizableViews.length > 1 && (
        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-md self-start">
          {customizableViews.map((item: MediaItem) => {
            const originalIndex = media.findIndex((m) => m.id === item.id);
            const isActive = activeIndex === originalIndex;
            const sideName = item.mockupSideName && item.mockupSideName.trim() !== ""
              ? item.mockupSideName.trim()
              : isMultiFace && item.id === mockupBackImageId
              ? "Tampak Belakang"
              : isMultiFace && item.id === mockupFrontImageId
              ? "Tampak Depan"
              : (item.mockupAreas?.[0]?.label.toLowerCase().includes("back") ||
                 item.url.toLowerCase().includes("back") ||
                 (item.mockupAreas && item.mockupAreas.some((a: MockupArea) => a.label.toLowerCase().includes("belakang"))))
              ? "Tampak Belakang"
              : item.mockupAreas?.[0]?.label || "Tampak Depan";

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
                {sideName}
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
              className="object-contain p-2"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />

            {/* Render Overlay Mockup Area Guides */}
            {isImageCustomizable(activeMedia) && activeMedia.mockupAreas?.map((area) => {
              const logoList = uploads[area.id] || [];
              return (
                <div
                  key={`guide-${area.id}`}
                  style={{
                    position: "absolute",
                    left: `${area.x}%`,
                    top: `${area.y}%`,
                    width: `${area.width}%`,
                    height: `${area.height}%`,
                  }}
                  onClick={() => triggerUpload(area.id)}
                  className={`border-2 border-dashed flex flex-col items-center justify-center p-1 rounded-sm group transition-colors select-none ${
                    logoList.length > 0
                      ? "border-green-400/50 bg-green-500/2"
                      : "border-blue-400/60 bg-blue-500/3 hover:bg-blue-500/6 cursor-pointer"
                  }`}
                  title={logoList.length > 0 ? `Klik untuk tambah logo ke area: ${activeMedia.mockupSideName || area.label}` : `Klik untuk unggah logo ke area: ${activeMedia.mockupSideName || area.label}`}
                >
                  {logoList.length === 0 && (
                    <>
                      <Plus className="w-3.5 h-3.5 text-blue-500/60 group-hover:text-blue-600 transition-colors" />
                      <span className="text-[7.5px] font-bold text-blue-600/80 uppercase tracking-widest text-center leading-tight">
                        {activeMedia.mockupSideName || area.label}
                      </span>
                    </>
                  )}
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={(el) => {
                      fileInputRefs.current[area.id] = el;
                    }}
                    onChange={(e) => handleFileChange(area, e)}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              );
            })}

            {/* Render Draggable Logo Layers relative to the parent canvas box */}
            {isImageCustomizable(activeMedia) && activeMedia.mockupAreas?.map((area) => {
              const logoList = uploads[area.id] || [];
              return logoList.map((logo) => {
                const isActive = activeLogoId === logo.id;
                return (
                  <div
                    key={`logo-${logo.id}`}
                    onPointerDown={(e) => handleLogoPointerDown(area.id, logo.id, e)}
                    onPointerMove={(e) => handleLogoPointerMove(area.id, logo.id, e)}
                    onPointerUp={(e) => handleLogoPointerUp(area.id, logo.id, e)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLogoId(logo.id);
                    }}
                    className={`absolute group p-0.5 border-2 transition-shadow select-none ${
                      isActive
                        ? "border-blue-500 shadow-md shadow-blue-500/20"
                        : "border-transparent hover:border-blue-300"
                    }`}
                    style={{
                      position: "absolute",
                      left: `${logo.xOffset}%`,
                      top: `${logo.yOffset}%`,
                      width: `${logo.scale}%`,
                      transform: `rotate(${logo.rotate || 0}deg)`,
                      opacity: (logo.opacity ?? 100) / 100,
                      cursor: isDragging && isActive ? "grabbing" : "grab",
                      touchAction: "none",
                      zIndex: isActive ? 20 : 10,
                    }}
                  >
                    <img
                      src={logo.image}
                      alt={logo.fileName}
                      className="w-full h-auto object-contain select-none pointer-events-none"
                    />
                    {/* Badge Label Area */}
                    {isActive && (
                      <div className="absolute -top-5 left-0 bg-blue-600 text-white text-[7px] font-bold px-1.5 py-0.5 rounded uppercase select-none pointer-events-none leading-none whitespace-nowrap z-10">
                        {activeMedia.mockupSideName || area.label}
                      </div>
                    )}
                    {/* Floating Alignment Shortcuts Toolbar */}
                    {isActive && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 bg-stone-900/90 text-white rounded shadow-lg px-2 py-1 flex items-center gap-1.5 z-30 select-none backdrop-blur-xs"
                        style={{
                          top: (logo.yOffset ?? 0) < 10 ? "calc(100% + 8px)" : "-38px",
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => alignLogo(area.id, logo.id, "left")}
                          className="p-1 hover:bg-stone-800 rounded transition-colors text-white cursor-pointer"
                          title="Align Left"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22V2M8 4h12M8 12h8M8 20h12"/></svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => alignLogo(area.id, logo.id, "center-horiz")}
                          className="p-1 hover:bg-stone-800 rounded transition-colors text-white cursor-pointer"
                          title="Align Center Horizontally"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M8 5h8M6 12h12M8 19h8"/></svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => alignLogo(area.id, logo.id, "right")}
                          className="p-1 hover:bg-stone-800 rounded transition-colors text-white cursor-pointer"
                          title="Align Right"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 22V2M4 4h12M8 12h8M4 20h12"/></svg>
                        </button>
                        <div className="w-[1px] h-4 bg-stone-700 mx-0.5" />
                        <button
                          type="button"
                          onClick={() => alignLogo(area.id, logo.id, "top")}
                          className="p-1 hover:bg-stone-800 rounded transition-colors text-white cursor-pointer"
                          title="Align Top"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 4H2M4 8v12M12 8v8M20 8v12"/></svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => alignLogo(area.id, logo.id, "center-vert")}
                          className="p-1 hover:bg-stone-800 rounded transition-colors text-white cursor-pointer"
                          title="Align Center Vertically"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h20M5 8v8M12 6v12M19 8v8"/></svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => alignLogo(area.id, logo.id, "bottom")}
                          className="p-1 hover:bg-stone-800 rounded transition-colors text-white cursor-pointer"
                          title="Align Bottom"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 20H2M4 4v12M12 8v8M20 4v12"/></svg>
                        </button>
                      </div>
                    )}
                  </div>
                );
              });
            })}

            {/* Distance Guidelines Overlay */}
            {isImageCustomizable(activeMedia) && activeMedia.mockupAreas?.map((area) => {
              const logoList = uploads[area.id] || [];
              return logoList.map((logo) => {
                const isActive = activeLogoId === logo.id;
                if (!isActive) return null;

                const scale = logo.scale ?? 10;
                const xOffset = logo.xOffset ?? area.x;
                const yOffset = logo.yOffset ?? area.y;
                const aspect = logo.aspectRatio || 1.0;
                const logoHeight = scale / aspect;

                const leftDistance = xOffset - area.x;
                const rightDistance = (area.x + area.width) - (xOffset + scale);
                const topDistance = yOffset - area.y;
                const bottomDistance = (area.y + area.height) - (yOffset + logoHeight);

                const getDisplayDist = (distPct: number, physicalSize?: number, baseSize?: number) => {
                  if (physicalSize && baseSize) {
                    const cmVal = distPct * (physicalSize / baseSize);
                    return `${Math.round(cmVal * 10) / 10} ${area.unit || "cm"}`;
                  }
                  return `${Math.round(distPct)}%`;
                };

                return (
                  <div key={`guidelines-${logo.id}`} className="absolute inset-0 pointer-events-none z-15">
                    {/* Left Line */}
                    {leftDistance > 0.5 && (
                      <div
                        className="absolute border-t border-dashed border-indigo-500/80 flex items-center justify-center"
                        style={{
                          left: `${area.x}%`,
                          width: `${leftDistance}%`,
                          top: `${yOffset + logoHeight / 2}%`,
                          height: "1px",
                        }}
                      >
                        <span className="bg-indigo-600 text-white text-[8px] font-bold px-1 py-0.5 rounded shadow leading-none select-none -translate-y-1/2">
                          {getDisplayDist(leftDistance, area.physicalWidth, area.width)}
                        </span>
                      </div>
                    )}

                    {/* Right Line */}
                    {rightDistance > 0.5 && (
                      <div
                        className="absolute border-t border-dashed border-indigo-500/80 flex items-center justify-center"
                        style={{
                          left: `${xOffset + scale}%`,
                          width: `${rightDistance}%`,
                          top: `${yOffset + logoHeight / 2}%`,
                          height: "1px",
                        }}
                      >
                        <span className="bg-indigo-600 text-white text-[8px] font-bold px-1 py-0.5 rounded shadow leading-none select-none -translate-y-1/2">
                          {getDisplayDist(rightDistance, area.physicalWidth, area.width)}
                        </span>
                      </div>
                    )}

                    {/* Top Line */}
                    {topDistance > 0.5 && (
                      <div
                        className="absolute border-l border-dashed border-indigo-500/80 flex items-center justify-center"
                        style={{
                          left: `${xOffset + scale / 2}%`,
                          top: `${area.y}%`,
                          height: `${topDistance}%`,
                          width: "1px",
                        }}
                      >
                        <span className="bg-indigo-600 text-white text-[8px] font-bold px-1 py-0.5 rounded shadow leading-none select-none -translate-x-1/2">
                          {getDisplayDist(topDistance, area.physicalHeight, area.height)}
                        </span>
                      </div>
                    )}

                    {/* Bottom Line */}
                    {bottomDistance > 0.5 && (
                      <div
                        className="absolute border-l border-dashed border-indigo-500/80 flex items-center justify-center"
                        style={{
                          left: `${xOffset + scale / 2}%`,
                          top: `${yOffset + logoHeight}%`,
                          height: `${bottomDistance}%`,
                          width: "1px",
                        }}
                      >
                        <span className="bg-indigo-600 text-white text-[8px] font-bold px-1 py-0.5 rounded shadow leading-none select-none -translate-x-1/2">
                          {getDisplayDist(bottomDistance, area.physicalHeight, area.height)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              });
            })}
          </div>
        )}
      </div>

      {/* ── Status Kustomisasi (Panel Bawah) ── */}
      <div className="bg-stone-50 border border-stone-200/80 p-4 rounded-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-800 mb-4 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#C4A48E]" /> LOGO PER AREA
        </h3>
        {isImageCustomizable(activeMedia) && activeMedia.mockupAreas && activeMedia.mockupAreas.length > 0 ? (
          <div className="flex flex-col gap-4">
            {activeMedia.mockupAreas.map((area) => {
              const logoList = uploads[area.id] || [];
              return (
                <div key={area.id} className="space-y-2">
                  {/* Area Header dengan tombol Tambah */}
                  <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
                    <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                      {activeMedia.mockupSideName || area.label} {area.physicalWidth && area.physicalHeight ? `(${area.physicalWidth} × ${area.physicalHeight} ${area.unit || "cm"})` : ""}
                    </span>
                    <button
                      type="button"
                      onClick={() => triggerUpload(area.id)}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 bg-blue-50 hover:bg-blue-100/70 px-2 py-0.5 rounded-sm transition-colors uppercase tracking-wider"
                    >
                      <Plus className="w-3 h-3" /> Tambah
                    </button>
                  </div>
                  {logoList.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {logoList.map((logo) => {
                        const isActive = activeLogoId === logo.id;
                        const logoCmWidth = ((logo.scale || 5) / area.width) * (area.physicalWidth || 0);
                        const logoCmHeight = logoCmWidth / (logo.aspectRatio || 1.0);
                        return (
                          <div
                            key={logo.id}
                            onClick={() => setActiveLogoId(logo.id)}
                            className={`flex items-center justify-between p-2.5 bg-white border rounded-sm transition-colors cursor-pointer ${
                              isActive ? "border-blue-500 ring-1 ring-blue-500" : "border-stone-200 hover:border-stone-300"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-8 h-8 rounded-sm bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden shrink-0">
                                <img src={logo.image} alt={logo.fileName} className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-stone-800 leading-tight truncate max-w-[180px]">
                                  {logo.fileName}
                                </p>
                                <p className="text-[10px] text-stone-400 mt-0.5">
                                  {Math.round(logo.scale || 5)}% - {logo.rotate || 0}° - {logo.opacity ?? 100}%
                                  {area.physicalWidth && logo.aspectRatio ? ` ≈ ${Math.round(logoCmWidth * 10) / 10} × ${Math.round(logoCmHeight * 10) / 10} ${area.unit || "cm"}` : ""}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                              {/* Quantity Counter */}
                              <div className="flex items-center border border-stone-200 rounded-sm bg-stone-50 p-0.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentVal = logo.logoCount || 1;
                                    if (currentVal > 1) {
                                      setUploads((prev) => {
                                        const updated = (prev[area.id] || []).map(l => l.id === logo.id ? { ...l, logoCount: currentVal - 1 } : l);
                                        return { ...prev, [area.id]: updated };
                                      });
                                    }
                                  }}
                                  disabled={(logo.logoCount || 1) <= 1}
                                  className="px-1.5 py-0.5 text-xs font-bold text-stone-500 hover:text-stone-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                >
                                  -
                                </button>
                                <span className="px-2 text-xs font-semibold text-stone-700 select-none">
                                  {logo.logoCount || 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentVal = logo.logoCount || 1;
                                    setUploads((prev) => {
                                      const updated = (prev[area.id] || []).map(l => l.id === logo.id ? { ...l, logoCount: currentVal + 1 } : l);
                                      return { ...prev, [area.id]: updated };
                                    });
                                  }}
                                  className="px-1.5 py-0.5 text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => handleRemoveLogo(area.id, logo.id, e)}
                                className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[10px] text-stone-400 italic py-1">Belum ada logo diunggah</p>
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
 
        {/* ── MODIFIKASI LOGO TERPILIH Panel ── */}
        {(() => {
          let activeLogo: LogoItem | null = null;
          let activeArea: MockupArea | null = null;
 
          if (activeMedia.mockupAreas) {
            for (const area of activeMedia.mockupAreas) {
              const list = uploads[area.id] || [];
              const found = list.find((l) => l.id === activeLogoId);
              if (found) {
                activeLogo = found;
                activeArea = area;
                break;
              }
            }
          }
 
          if (!activeLogo || !activeArea) return null;
 
          const area = activeArea;
          const logo = activeLogo;
          const maxScale = getMaxScale(area, logo);
          const currentCmWidth = ((logo.scale || 5) / area.width) * (area.physicalWidth || 0);
          const currentCmHeight = currentCmWidth / (logo.aspectRatio || 1.0);
          const maxAreaPercent = Math.round((maxScale / area.width) * 100);
 
          return (
            <div className="mt-4 pt-4 border-t border-stone-200 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-blue-500 rounded-sm"></span> MODIFIKASI LOGO TERPILIH <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm">{activeMedia.mockupSideName || area.label}</span>
              </h4>
 
              {/* Physical Size Calculated Preview */}
              {area.physicalWidth && logo.aspectRatio && (
                <div className="bg-indigo-50/70 border border-indigo-100/80 p-2.5 rounded-sm flex items-center justify-between text-indigo-900">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    Ukuran Logo Terhitung:
                  </span>
                  <span className="text-[11px] font-bold">
                    ≈ {Math.round(currentCmWidth * 10) / 10} x {Math.round(currentCmHeight * 10) / 10} {area.unit || "cm"}
                  </span>
                </div>
              )}
 
              {/* Scale / Ukuran Sliders */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wide">Ukuran Logo</label>
                  {area.physicalWidth && (
                    <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-sm">
                      maks {maxAreaPercent}% — batas area
                    </span>
                  )}
                </div>
                <div className="flex gap-3 items-center">
                  <div className="flex-1 flex items-center gap-2.5">
                    <input
                      type="range"
                      min="5"
                      max={maxScale}
                      step="1"
                      value={Math.round(logo.scale || 5)}
                      onChange={(e) => updateTransform(area.id, logo.id, "scale", parseFloat(e.target.value))}
                      className="flex-1 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-700"
                    />
                    <div className="flex items-center border border-stone-300 rounded bg-white px-1 shrink-0">
                      <input
                        type="number"
                        min="5"
                        max={Math.round(maxScale)}
                        value={Math.round(logo.scale || 5)}
                        onChange={(e) => {
                          const pct = parseFloat(e.target.value) || 5;
                          updateTransform(area.id, logo.id, "scale", pct);
                        }}
                        className="w-10 text-[10px] text-center border-none p-0.5 focus:ring-0 focus:outline-none font-semibold text-stone-700"
                      />
                      <span className="text-[9px] font-bold text-stone-400 border-l pl-1 ml-0.5">%</span>
                    </div>
                  </div>
 
                  {area.physicalWidth && (
                    <div className="w-[85px] shrink-0 flex items-center border border-stone-300 rounded bg-white px-1">
                      <input
                        type="number"
                        step="0.1"
                        value={Math.round(currentCmWidth * 10) / 10}
                        onChange={(e) => {
                          const valCm = parseFloat(e.target.value) || 0;
                          const newScale = (valCm / (area.physicalWidth || 1)) * area.width;
                          updateTransform(area.id, logo.id, "scale", newScale);
                        }}
                        className="w-12 text-[10px] text-center border-none p-0.5 focus:ring-0 focus:outline-none font-semibold text-stone-700"
                      />
                      <span className="text-[9px] font-bold text-stone-400 border-l pl-1 ml-0.5">{area.unit || "cm"}</span>
                    </div>
                  )}
                </div>
              </div>
 
              {/* Rotate / Putar */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wide">Rotasi</label>
                <div className="flex gap-2.5 items-center">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={logo.rotate || 0}
                    onChange={(e) => updateTransform(area.id, logo.id, "rotate", parseInt(e.target.value))}
                    className="flex-1 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-700"
                  />
                  <div className="w-16 flex items-center border border-stone-300 rounded bg-white px-1 shrink-0">
                    <input
                      type="number"
                      min="0"
                      max="360"
                      value={logo.rotate || 0}
                      onChange={(e) => {
                        const rot = parseInt(e.target.value) || 0;
                        updateTransform(area.id, logo.id, "rotate", rot);
                      }}
                      className="w-8 text-[10px] text-center border-none p-0.5 focus:ring-0 focus:outline-none font-semibold text-stone-700"
                    />
                    <span className="text-[9px] font-bold text-stone-400 border-l pl-1 ml-0.5">°</span>
                  </div>
                </div>
              </div>
 
              {/* Opasitas */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wide">Opasitas</label>
                <div className="flex gap-2.5 items-center">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="1"
                    value={logo.opacity ?? 100}
                    onChange={(e) => updateTransform(area.id, logo.id, "opacity", parseInt(e.target.value))}
                    className="flex-1 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-700"
                  />
                  <div className="w-16 flex items-center border border-stone-300 rounded bg-white px-1 shrink-0">
                    <input
                      type="number"
                      min="10"
                      max="100"
                      value={logo.opacity ?? 100}
                      onChange={(e) => {
                        const op = parseInt(e.target.value) || 100;
                        updateTransform(area.id, logo.id, "opacity", op);
                      }}
                      className="w-8 text-[10px] text-center border-none p-0.5 focus:ring-0 focus:outline-none font-semibold text-stone-700"
                    />
                    <span className="text-[9px] font-bold text-stone-400 border-l pl-1 ml-0.5">%</span>
                  </div>
                </div>
              </div>
 
              {/* Offset X & Y Sliders */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                {/* Geser X */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wide">Geser X (Horiz)</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="range"
                      min={area.x}
                      max={area.x + area.width - (logo.scale || 10)}
                      step="0.5"
                      value={logo.xOffset || area.x}
                      onChange={(e) => updateTransform(area.id, logo.id, "xOffset", parseFloat(e.target.value))}
                      className="flex-1 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-700"
                    />
                    <span className="text-[10px] font-bold text-stone-600 w-10 text-right shrink-0">{Math.round(logo.xOffset || area.x)}%</span>
                  </div>
                </div>
                {/* Geser Y */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wide">Geser Y (Vert)</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="range"
                      min={area.y}
                      max={area.y + area.height - ((logo.scale || 10) / (logo.aspectRatio || 1.0))}
                      step="0.5"
                      value={logo.yOffset || area.y}
                      onChange={(e) => updateTransform(area.id, logo.id, "yOffset", parseFloat(e.target.value))}
                      className="flex-1 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-700"
                    />
                    <span className="text-[10px] font-bold text-stone-600 w-10 text-right shrink-0">{Math.round(logo.yOffset || area.y)}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
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
                    <span className="absolute bottom-0 inset-x-0 bg-stone-900/90 text-[7px] text-white font-bold uppercase py-1 text-center leading-tight tracking-wider px-1 truncate" title={item.mockupSideName || item.mockupAreas?.map((a) => a.label).join(" & ") || ""}>
                      {item.mockupSideName || item.mockupAreas?.map((a) => a.label).join(" & ") || "Kustom"}
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
