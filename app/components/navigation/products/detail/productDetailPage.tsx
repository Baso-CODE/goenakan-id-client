"use client";

import { useCartStore } from "@/app/store/useCartStore";
import { AddToCartPayload } from "@/app/types/itemCart/addToCartPayload.type";
import { MediaItem, ProductDetail } from "@/app/types/productDetail.type";
import { useRouter } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { useMemo, useState, useEffect, useCallback } from "react";
import { Sparkles } from "lucide-react";
import { PriceTierSelector } from "./priceTierSelector";
import { ProductDescription } from "./productDescription";
import { ProductImageGallery } from "./productImageGallery";
import { ProductCustomizer } from "./productCustomizer";
import { QuantitySelector } from "./quantitySelector";
import { ShareBar } from "./sharebar";
import { WhatsAppBanner } from "./whatsappBanner";

const PREDEFINED_COLORS: Record<string, { hex: string; cmyk: string }> = {
  "hitam": { hex: "#000000", cmyk: "C:0 M:0 Y:0 K:100" },
  "black": { hex: "#000000", cmyk: "C:0 M:0 Y:0 K:100" },
  "putih": { hex: "#ffffff", cmyk: "C:0 M:0 Y:0 K:0" },
  "white": { hex: "#ffffff", cmyk: "C:0 M:0 Y:0 K:0" },
  "merah": { hex: "#e11d48", cmyk: "C:0 M:95 Y:70 K:12" },
  "red": { hex: "#e11d48", cmyk: "C:0 M:95 Y:70 K:12" },
  "biru": { hex: "#2563eb", cmyk: "C:84 M:54 Y:0 K:8" },
  "blue": { hex: "#2563eb", cmyk: "C:84 M:54 Y:0 K:8" },
  "kuning": { hex: "#eab308", cmyk: "C:0 M:23 Y:95 K:8" },
  "yellow": { hex: "#eab308", cmyk: "C:0 M:23 Y:95 K:8" },
  "hijau": { hex: "#16a34a", cmyk: "C:86 M:0 Y:85 K:36" },
  "green": { hex: "#16a34a", cmyk: "C:86 M:0 Y:85 K:36" },
  "abu-abu": { hex: "#78716c", cmyk: "C:0 M:0 Y:0 K:60" },
  "grey": { hex: "#78716c", cmyk: "C:0 M:0 Y:0 K:60" },
  "orange": { hex: "#ea580c", cmyk: "C:0 M:60 Y:100 K:8" },
  "oranye": { hex: "#ea580c", cmyk: "C:0 M:60 Y:100 K:8" },
};

function hexToCmyk(hex: string) {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const k = 1 - Math.max(r, g, b);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }
  const c = Math.round(((1 - r - k) / (1 - k)) * 100);
  const m = Math.round(((1 - g - k) / (1 - k)) * 100);
  const y = Math.round(((1 - b - k) / (1 - k)) * 100);
  const kPercent = Math.round(k * 100);

  return { c, m, y, k: kPercent };
}

function parseClientColorValue(val: string) {
  if (!val) return { name: "", hex: "#000000", cmyk: "C: 0 | M: 0 | Y: 0 | K: 100" };
  const parts = val.split("|");
  if (parts.length === 3) {
    const name = parts[0];
    const hex = parts[1];
    const cmykMatch = parts[2].match(/cmyk\((\d+),(\d+),(\d+),(\d+)\)/);
    if (cmykMatch) {
      const c = cmykMatch[1];
      const m = cmykMatch[2];
      const y = cmykMatch[3];
      const k = cmykMatch[4];
      return {
        name,
        hex,
        cmyk: `C: ${c} | M: ${m} | Y: ${y} | K: ${k}`,
      };
    }
    return { name, hex, cmyk: "C: 0 | M: 0 | Y: 0 | K: 100" };
  } else if (parts.length === 2) {
    const name = parts[0];
    const hex = parts[1];
    const cmyk = hexToCmyk(hex);
    return { name, hex, cmyk: `C: ${cmyk.c} | M: ${cmyk.m} | Y: ${cmyk.y} | K: ${cmyk.k}` };
  } else if (val.startsWith("#")) {
    const cmyk = hexToCmyk(val);
    return { name: "", hex: val, cmyk: `C: ${cmyk.c} | M: ${cmyk.m} | Y: ${cmyk.y} | K: ${cmyk.k}` };
  }
  
  // Try predefined color matching
  const colorName = val.toLowerCase().trim();
  if (PREDEFINED_COLORS[colorName]) {
    const info = PREDEFINED_COLORS[colorName];
    return { name: val, hex: info.hex, cmyk: info.cmyk.replace(/:/g, ": ") };
  }
  
  return { name: val, hex: "#cbd5e1", cmyk: "CMYK N/A" };
}

interface ProductDetailPageProps {
  product: ProductDetail;
}

export function ProductDetailPage({ product }: ProductDetailPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const addToCart = useCartStore((state) => state.addToCart);
  const [customization, setCustomization] = useState<any>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleCustomizingChange = (val: boolean) => {
    setIsCustomizing(val);
    if (!val) {
      setCustomization(null);
    }
  };



  // 1. Group unique attributes and values
  const attributeGroups = useMemo(() => {
    const groups: Record<
      string,
      {
        values: Set<string>;
        attributePosition: number;
        valuePositions: Record<string, number>;
        type: string;
        parentValueId: string | null;
      }
    > = {};

    product.variants?.forEach((variant) => {
      variant.attributes?.forEach((attr) => {
        if (!groups[attr.name]) {
          groups[attr.name] = {
            values: new Set<string>(),
            attributePosition: (attr as any).attributePosition ?? 0,
            valuePositions: {},
            type: attr.type || "TEXT",
            parentValueId: attr.parentValueId || null,
          };
        }
        groups[attr.name].values.add(attr.value);
        groups[attr.name].valuePositions[attr.value] =
          (attr as any).valuePosition ?? 0;
      });
    });

    return Object.entries(groups)
      .map(([name, { values, attributePosition, valuePositions, type, parentValueId }]) => {
        const sortedValues = Array.from(values).sort((a, b) => {
          return (valuePositions[a] ?? 0) - (valuePositions[b] ?? 0);
        });
        return {
          name,
          values: sortedValues,
          attributePosition,
          type,
          parentValueId,
        };
      })
      .sort((a, b) => a.attributePosition - b.attributePosition);
  }, [product.variants]);

  // 2. Selection state tracking
  const [selections, setSelections] = useState<Record<string, string>>({});

  // 3. Tentukan Varian Default
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  // 4. Auto-select first in-stock variant attributes on mount
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const inStockVariant = product.variants.find((v) => (v.stock ?? 0) > 0);
      if (inStockVariant) {
        const initialSelections: Record<string, string> = {};
        inStockVariant.attributes?.forEach((attr) => {
          initialSelections[attr.name] = attr.value;
        });
        setSelections(initialSelections);
        setSelectedVariantId(inStockVariant.id);
      } else {
        // If all are out of stock, do not select any variant by default
        setSelections({});
        setSelectedVariantId(null);
      }
    }
  }, [product.variants]);

  // 5. Availability matrix checker
  const isOptionDisabled = (attrName: string, value: string) => {
    const simulated = { ...selections, [attrName]: value };
    const match = product.variants?.some((variant) => {
      const matchesAll = Object.entries(simulated).every(([name, val]) => {
        const attr = variant.attributes?.find((a) => a.name === name);
        return attr?.value === val;
      });
      return matchesAll && (variant.stock ?? 0) > 0;
    });
    return !match;
  };

  // 6. Click handler
  const handleSelectOption = (attrName: string, value: string) => {
    const nextSelections = { ...selections, [attrName]: value };
    setSelections(nextSelections);

    // Find corresponding variant
    const variantMatch = product.variants?.find((v) => {
      return Object.entries(nextSelections).every(([name, val]) => {
        const attr = v.attributes?.find((a) => a.name === name);
        return attr?.value === val;
      });
    });

    if (variantMatch) {
      handleVariantSelect(variantMatch.id);
    }
  };

  const selectedVariant = useMemo(() => {
    return product.variants?.find((v) => v.id === selectedVariantId);
  }, [product.variants, selectedVariantId]);

  const selectedAttributeValueIds = useMemo(() => {
    const ids: string[] = [];
    
    if (selectedVariant && selectedVariant.attributes) {
      selectedVariant.attributes.forEach((attr: any) => {
        if (attr.attributeValueId) {
          ids.push(attr.attributeValueId);
        } else {
          const match = product.attributeValues?.find(
            (av) => av.attributeName === attr.name && av.value === attr.value
          );
          if (match) {
            ids.push(match.attributeValueId);
          }
        }
      });
    }

    Object.entries(selections).forEach(([groupName, val]) => {
      product.attributeValues?.forEach((av: any) => {
        if (av.attributeName === groupName && av.value === val) {
          ids.push(av.attributeValueId);
        }
      });
      
      product.variants?.forEach((v) => {
        v.attributes?.forEach((attr: any) => {
          if (attr.name === groupName && attr.value === val && attr.attributeValueId) {
            if (!ids.includes(attr.attributeValueId)) {
              ids.push(attr.attributeValueId);
            }
          }
        });
      });
    });

    return ids;
  }, [selectedVariant, selections, product.attributeValues, product.variants]);

  // Track if current selection (or entire product) is out of stock
  const isOutOfStock = useMemo(() => {
    if (product.isMadeByOrder) {
      return false;
    }
    if (selectedVariant) {
      return (selectedVariant.stock ?? 0) <= 0;
    }
    if (product.variants && product.variants.length > 0) {
      return product.variants.every((v) => (v.stock ?? 0) <= 0);
    }
    return (Number(product.stock) || 0) <= 0;
  }, [selectedVariant, product]);

  // 2. Tentukan Price Tiers Aktif (Prioritas: Varian > Induk, dengan penyesuaian harga varian)
  const activeTiers = useMemo(() => {
    if (selectedVariant?.priceTiers && selectedVariant.priceTiers.length > 0) {
      return selectedVariant.priceTiers;
    }
    const baseTiers = product.priceTiers || [];
    if (!selectedVariant || baseTiers.length === 0) {
      return baseTiers;
    }

    const baselinePrice = product.basePrice ?? baseTiers[0].pricePerPcs ?? 0;
    const variantPrice = selectedVariant.price ?? baselinePrice;
    const diff = variantPrice - baselinePrice;

    return baseTiers.map((tier) => ({
      ...tier,
      pricePerPcs: Math.max(0, (tier.pricePerPcs ?? 0) + diff),
    }));
  }, [selectedVariant, product.priceTiers, product.variants]);

  // 3. Pastikan quantity awal sinkron dengan tier saat komponen pertama kali dimuat
  const [quantity, setQuantity] = useState(() => {
    return activeTiers.length > 0 ? (activeTiers[0].minQty ?? 1) : 1;
  });

  // ✨ PERBAIKAN 1: Pindahkan logika useEffect ke dalam fungsi onClick varian
  const handleVariantSelect = (variantId: string) => {
    setSelectedVariantId(variantId);

    // Cari tahu tier mana yang akan aktif setelah varian ini dipilih
    const variant = product.variants?.find((v) => v.id === variantId);
    let newActiveTiers =
      variant?.priceTiers && variant.priceTiers.length > 0
        ? variant.priceTiers
        : product.priceTiers || [];

    if (variant && (!variant.priceTiers || variant.priceTiers.length === 0) && product.priceTiers && product.priceTiers.length > 0) {
      const baselinePrice = product.basePrice ?? product.priceTiers[0].pricePerPcs ?? 0;
      const variantPrice = variant.price ?? baselinePrice;
      const diff = variantPrice - baselinePrice;
      newActiveTiers = product.priceTiers.map((t) => ({
        ...t,
        pricePerPcs: Math.max(0, (t.pricePerPcs ?? 0) + diff),
      }));
    }

    // Jika quantity saat ini kurang dari batas minimal tier baru, naikkan angkanya
    if (newActiveTiers.length > 0) {
      const minQty = newActiveTiers[0].minQty ?? 1;
      if (quantity < minQty) {
        setQuantity(minQty);
      }
    }
  };

  // ✨ PERBAIKAN 2: Derive selectedTierIndex langsung dari quantity (Tanpa useState & useEffect)
  const selectedTierIndex = useMemo(() => {
    if (!activeTiers || activeTiers.length === 0) return 0;

    let matchedIndex = 0;
    for (let i = 0; i < activeTiers.length; i++) {
      const min = activeTiers[i].minQty ?? 1;
      if (quantity >= min) {
        matchedIndex = i;
      }
    }
    return matchedIndex;
  }, [quantity, activeTiers]);

  const customOptionsPriceModifier = useMemo(() => {
    if (!isCustomizing || !customization || !customization.zones) {
      return 0;
    }

    let totalModifier = 0;
    console.log("--- START PRICING CALCULATION ---");
    console.log("Customization zones:", Object.values(customization.zones).map((z: any) => ({ label: z.label, logoCount: z.logoCount })));

    if (product.attributeValues) {
      // Hitung total logo yang diunggah di semua area mockup
      const totalLogosCount = Object.values(customization.zones).reduce(
        (sum: number, z: any) => sum + (z.logoCount || 1),
        0
      );

      product.attributeValues.forEach((av: any) => {
        const valueName = av.value?.toLowerCase().trim();
        const attrName = av.attributeName?.toLowerCase().trim() || "";
        if (!valueName) return;

        // Lewati opsi "no print" / "tanpa cetak" / "polosan"
        if (
          valueName.includes("no print") ||
          valueName.includes("tanpa") ||
          valueName.includes("polos")
        ) {
          console.log(`Skipping no-print option: ${av.attributeName} = ${av.value}`);
          return;
        }

        // 1. Cek kecocokan posisi spesifik (misal: "Front Print" cocok dengan "Tampak Depan")
        const matchingZone = Object.values(customization.zones).find((z: any) => {
          if (z.printPositionValueId && z.printPositionValueId === av.attributeValueId) {
            return true;
          }
          const label = z.label?.toLowerCase().trim();
          if (!label) return false;
          const cleanLabel = label.replace(/[^a-z0-9]/g, "");
          const cleanVal = valueName.replace(/[^a-z0-9]/g, "");

          // Kecocokan depan / front
          const isLabelFront = cleanLabel.includes("front") || cleanLabel.includes("depan");
          const isValFront = cleanVal.includes("front") || cleanVal.includes("depan");
          if (isLabelFront && isValFront) return true;

          // Kecocokan belakang / back
          const isLabelBack = cleanLabel.includes("back") || cleanLabel.includes("belakang");
          const isValBack = cleanVal.includes("back") || cleanVal.includes("belakang");
          if (isLabelBack && isValBack) return true;

          return cleanLabel === cleanVal || cleanLabel.includes(cleanVal) || cleanVal.includes(cleanLabel);
        }) as any;

        if (matchingZone) {
          totalModifier += (av.priceModifier ?? 0);
          console.log(`Matched position: ${av.attributeName} = ${av.value}. Adding priceModifier = ${av.priceModifier}. Running total = ${totalModifier}`);
        } else {
          // 2. Opsi Cetak Logo Generik: Jika atribut atau nilainya mengandung cetak/logo/print,
          // tapi tidak merujuk pada posisi spesifik (depan/belakang/front/back).
          const isPrintAttr =
            attrName.includes("print") ||
            attrName.includes("logo") ||
            attrName.includes("cetak") ||
            valueName.includes("print") ||
            valueName.includes("logo") ||
            valueName.includes("cetak");

          const specifiesPosition =
            valueName.includes("front") ||
            valueName.includes("depan") ||
            valueName.includes("back") ||
            valueName.includes("belakang") ||
            valueName.includes("left") ||
            valueName.includes("kiri") ||
            valueName.includes("right") ||
            valueName.includes("kanan") ||
            valueName.includes("top") ||
            valueName.includes("atas") ||
            valueName.includes("bottom") ||
            valueName.includes("bawah") ||
            valueName.includes("samping") ||
            valueName.includes("side") ||
            valueName.includes("tutup") ||
            valueName.includes("lid") ||
            attrName.includes("posisi") ||
            attrName.includes("position") ||
            attrName.includes("sisi") ||
            attrName.includes("side");

          const customizedSidesCount = Object.keys(customization.zones).length;

          if (isPrintAttr && !specifiesPosition && customizedSidesCount > 0) {
            // Kalikan modifier harga per sisi dengan jumlah sisi yang dikustomisasi
            totalModifier += (av.priceModifier ?? 0) * customizedSidesCount;
            console.log(`Matched generic print fee: ${av.attributeName} = ${av.value}. Adding priceModifier ${av.priceModifier} * ${customizedSidesCount} = ${av.priceModifier * customizedSidesCount}. Running total = ${totalModifier}`);
          } else {
            console.log(`Skipped attribute (no match): ${av.attributeName} = ${av.value} (isPrintAttr=${isPrintAttr}, specifiesPosition=${specifiesPosition}, modifier=${av.priceModifier})`);
          }
        }
      });
    }

    console.log("Final computed customOptionsPriceModifier =", totalModifier);
    console.log("--- END PRICING CALCULATION ---");
    return totalModifier;
  }, [isCustomizing, customization, product.attributeValues]);

  const activePrintFeesList = useMemo(() => {
    if (!isCustomizing || !customization || !customization.zones || !product.attributeValues) {
      return [];
    }

    const list: { name: string; modifier: number }[] = [];

    product.attributeValues.forEach((av: any) => {
      const valueName = av.value?.toLowerCase().trim();
      const attrName = av.attributeName?.toLowerCase().trim() || "";
      if (!valueName) return;

      if (
        valueName.includes("no print") ||
        valueName.includes("tanpa") ||
        valueName.includes("polos")
      ) {
        return;
      }

      // 1. Cek kecocokan posisi spesifik
      const matchingZone = Object.values(customization.zones).find((z: any) => {
        if (z.printPositionValueId && z.printPositionValueId === av.attributeValueId) {
          return true;
        }
        const label = z.label?.toLowerCase().trim();
        if (!label) return false;
        const cleanLabel = label.replace(/[^a-z0-9]/g, "");
        const cleanVal = valueName.replace(/[^a-z0-9]/g, "");

        const isLabelFront = cleanLabel.includes("front") || cleanLabel.includes("depan");
        const isValFront = cleanVal.includes("front") || cleanVal.includes("depan");
        if (isLabelFront && isValFront) return true;

        const isLabelBack = cleanLabel.includes("back") || cleanLabel.includes("belakang");
        const isValBack = cleanVal.includes("back") || cleanVal.includes("belakang");
        if (isLabelBack && isValBack) return true;

        return cleanLabel === cleanVal || cleanLabel.includes(cleanVal) || cleanVal.includes(cleanLabel);
      }) as any;

      if (matchingZone) {
        if ((av.priceModifier ?? 0) > 0) {
          list.push({
            name: `${av.attributeName}: ${av.value}`,
            modifier: av.priceModifier,
          });
        }
      } else {
        // 2. Opsi Cetak Logo Generik
        const isPrintAttr =
          attrName.includes("print") ||
          attrName.includes("logo") ||
          attrName.includes("cetak") ||
          valueName.includes("print") ||
          valueName.includes("logo") ||
          valueName.includes("cetak");

        const specifiesPosition =
          valueName.includes("front") ||
          valueName.includes("depan") ||
          valueName.includes("back") ||
          valueName.includes("belakang") ||
          valueName.includes("left") ||
          valueName.includes("kiri") ||
          valueName.includes("right") ||
          valueName.includes("kanan") ||
          valueName.includes("top") ||
          valueName.includes("atas") ||
          valueName.includes("bottom") ||
          valueName.includes("bawah") ||
          valueName.includes("samping") ||
          valueName.includes("side") ||
          valueName.includes("tutup") ||
          valueName.includes("lid") ||
          attrName.includes("posisi") ||
          attrName.includes("position") ||
          attrName.includes("sisi") ||
          attrName.includes("side");

        const customizedSidesCount = Object.keys(customization.zones).length;

        if (isPrintAttr && !specifiesPosition && customizedSidesCount > 0) {
          if ((av.priceModifier ?? 0) > 0) {
            list.push({
              name: `${av.attributeName}: ${av.value}`,
              modifier: av.priceModifier * customizedSidesCount,
            });
          }
        }
      }
    });

    return list;
  }, [isCustomizing, customization, product.attributeValues]);

  // 5. Kalkulasi Harga Final yang Tepat
  const basePrice = useMemo(() => {
    if (activeTiers && activeTiers.length > 0) {
      const tier = activeTiers[selectedTierIndex];
      return tier.pricePerPcs ?? 0;
    }
    if (selectedVariant?.price != null) {
      return selectedVariant.price;
    }
    return product.variants?.[0]?.price ?? 0;
  }, [activeTiers, selectedTierIndex, selectedVariant, product]);

  const finalPrice = basePrice + customOptionsPriceModifier;

  // ✨ PERBAIKAN 3: Cukup ubah quantity, dan selectedTierIndex akan otomatis mengikuti
  const handleTierSelect = (index: number) => {
    const min = activeTiers[index]?.minQty ?? 1;
    setQuantity(min);
  };

  const adminWhatsApp = "6282387902238";

  const allGalleryMediaForSize = useMemo(() => {
    let currentMedia: MediaItem[] = [];
    if (selectedVariantId && product.variants) {
      const variant = product.variants.find((v) => v.id === selectedVariantId);
      if (variant && variant.images) {
        currentMedia = [...variant.images];
      }
    }
    
    // Hanya tampilkan media umum, atau media yang ditautkan ke atribut varian yang sedang terpilih
    const productMedia = (product.media || []).filter((img) => {
      const isMockup = img.mockupAreas && img.mockupAreas.length > 0;
      if (isMockup) {
        // Mockup kustom wajib ditautkan ke varian untuk ditampilkan
        if (!img.attributeValueId) return false;
        return selectedAttributeValueIds.includes(img.attributeValueId);
      } else {
        // Gambar produk biasa
        if (!img.attributeValueId) return true;
        return selectedAttributeValueIds.includes(img.attributeValueId);
      }
    });

    return [...currentMedia, ...productMedia];
  }, [selectedVariantId, product, selectedAttributeValueIds]);

  const activeGalleryMedia = useMemo(() => {
    if (isCustomizing) {
      // Hanya tampilkan gambar yang memiliki area mockup kustom
      return allGalleryMediaForSize.filter((img) => img.mockupAreas && img.mockupAreas.length > 0);
    } else {
      // Tampilkan semua gambar (seperti semula)
      return allGalleryMediaForSize;
    }
  }, [allGalleryMediaForSize, isCustomizing]);

  const hasMockupAreas = useMemo(() => {
    const result = allGalleryMediaForSize.some((m) => m.mockupAreas && m.mockupAreas.length > 0);
    console.log("DEBUG: hasMockupAreas check on allGalleryMediaForSize =", result);
    return result;
  }, [allGalleryMediaForSize]);

  const doesSizeHaveMockups = useCallback((sizeValue: string) => {
    let sizeAttrValId: string | null = null;
    
    // Cari di variants attributes
    product.variants?.forEach((v) => {
      v.attributes?.forEach((attr: any) => {
        if (attr.value === sizeValue && attr.attributeValueId) {
          sizeAttrValId = attr.attributeValueId;
        }
      });
    });

    if (!sizeAttrValId) {
      // Cari di product.attributeValues
      const match = product.attributeValues?.find((av) => av.value === sizeValue);
      if (match) {
        sizeAttrValId = match.attributeValueId;
      }
    }

    if (!sizeAttrValId) return false;

    // Cek apakah ada image di parent media yang ditautkan ke sizeAttrValId ini dan memiliki area mockup
    const hasAreas = product.media?.some(
      (img) => img.attributeValueId === sizeAttrValId && img.mockupAreas && img.mockupAreas.length > 0
    );
    return !!hasAreas;
  }, [product.variants, product.attributeValues, product.media]);

  const resolvedVariantDetails = useMemo(() => {
    if (!selectedVariant) return null;

    // Default values from variant
    let weight = selectedVariant.weightString || "";
    let rawWeight = selectedVariant.rawWeight || null;
    let width = selectedVariant.width || null;
    let height = selectedVariant.height || null;
    let length = selectedVariant.length || null;
    let dimensions = selectedVariant.dimensionsString || "";

    // Find if any attribute of this variant has SIZE type with custom dimensions/weight
    if (selectedVariant.attributes && product.attributeValues) {
      for (const attr of selectedVariant.attributes) {
        const match = product.attributeValues.find(
          (av: any) =>
            av.attributeType === "SIZE" &&
            (av.attributeValueId === attr.attributeValueId ||
              (av.attributeName === attr.name && av.value === attr.value))
        );

        if (match) {
          // If match has custom dimensions or weight, use them!
          if (match.weight) {
            rawWeight = Number(match.weight);
            weight = `${match.weight} gram`;
          }
          if (match.width || match.height || match.length) {
            width = match.width ? Number(match.width) : null;
            height = match.height ? Number(match.height) : null;
            length = match.length ? Number(match.length) : null;
            dimensions = `${length || 0}x${width || 0}x${height || 0} cm`;
          }
          break; // Found the size attribute
        }
      }
    }

    return {
      weight,
      rawWeight,
      width,
      height,
      length,
      dimensions,
    };
  }, [selectedVariant, product.attributeValues]);

  const handleAddToCart = async () => {
    const variantWeight = resolvedVariantDetails ? resolvedVariantDetails.weight : (selectedVariant?.weightString || product.weight);
    const variantRawWeight = resolvedVariantDetails ? resolvedVariantDetails.rawWeight : (selectedVariant?.rawWeight || product.rawWeight);
    const variantWidth = resolvedVariantDetails ? resolvedVariantDetails.width : (selectedVariant?.width || product.width);
    const variantHeight = resolvedVariantDetails ? resolvedVariantDetails.height : (selectedVariant?.height || product.height);
    const variantLength = resolvedVariantDetails ? resolvedVariantDetails.length : (selectedVariant?.length || product.length);
    const variantDimensions = resolvedVariantDetails ? resolvedVariantDetails.dimensions : (selectedVariant?.dimensionsString || product.dimensions);

    const payload: AddToCartPayload = {
      id: product.id,
      name: product.name,
      price: finalPrice,
      image:
        selectedVariant?.images?.[0]?.url ||
        product.media?.[0]?.url ||
        "/images/products/demo-products.png",
      variantId: selectedVariantId,
      dimensions: variantDimensions,
      weight: variantWeight,
      materialType: product.materialType,
      rawWeight: variantRawWeight,
      width: variantWidth,
      height: variantHeight,
      length: variantLength,
      customization: customization,
    };

    await addToCart(payload, quantity, token);
  };

  const handleOrderNow = async () => {
    await handleAddToCart();
    router.push("/checkout");
  };

  const displayWeight = resolvedVariantDetails
    ? resolvedVariantDetails.weight
    : (selectedVariant ? selectedVariant.weightString : product.weight);

  const displayDimensions = resolvedVariantDetails
    ? resolvedVariantDetails.dimensions
    : (selectedVariant ? selectedVariant.dimensionsString : product.dimensions);

  const minAllowedQty =
    activeTiers.length > 0 ? (activeTiers[0].minQty ?? 1) : 1;

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* ── Left: Image Gallery ── */}
        <div className="flex flex-col gap-4">
          {product.isCustom && isCustomizing ? (
            <ProductCustomizer
              media={activeGalleryMedia}
              productName={product.name}
              isMultiFace={product.isMultiFace}
              mockupFrontImageId={product.mockupFrontImageId}
              mockupBackImageId={product.mockupBackImageId}
              selectedAttributeValueIds={selectedAttributeValueIds}
              onChange={setCustomization}
              attributeValues={product.attributeValues}
            />
          ) : (
            <ProductImageGallery
              media={activeGalleryMedia}
              productName={product.name}
            />
          )}
          <ShareBar productName={product.name} />
        </div>

        {/* ── Right: Product Info ── */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-stone-400 tracking-widest uppercase font-medium">
              {product.category}
            </p>
            <h1 className="text-xl font-bold text-stone-900 leading-snug">
              {product.name}
            </h1>
            <p className="text-sm text-stone-400">
              {product.sold.toLocaleString("id-ID")} Sold
            </p>
          </div>

          {/* ── Customization Type Selector ── */}
          {product.isCustom && (
            <div className="bg-stone-50 border border-stone-200/80 rounded-md p-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Pilih Tipe Pembelian
              </p>
              <div className="grid grid-cols-2 gap-3">
                {/* Option 1: Buy Polosan */}
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => handleCustomizingChange(false)}
                  className={`flex flex-col items-start p-3 border rounded-sm transition-all duration-200 text-left ${
                    isOutOfStock
                      ? "border-stone-100 bg-stone-50 text-stone-300 cursor-not-allowed opacity-50"
                      : !isCustomizing
                      ? "border-stone-900 bg-white ring-1 ring-stone-900 shadow-sm cursor-pointer"
                      : "border-stone-200 bg-white/40 hover:border-stone-400 hover:bg-white cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isOutOfStock ? "border-stone-200" : !isCustomizing ? "border-stone-900" : "border-stone-300"
                    }`}>
                      {!isOutOfStock && !isCustomizing && <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />}
                    </span>
                    <span className={`text-xs font-bold ${isOutOfStock ? "text-stone-300" : "text-stone-900"}`}>Beli Polosan</span>
                  </div>
                  <span className={`text-[10px] leading-normal font-normal ${isOutOfStock ? "text-stone-300" : "text-stone-500"}`}>
                    Tanpa cetak logo, proses pengiriman lebih cepat.
                  </span>
                </button>

                {/* Option 2: Custom Cetak Logo */}
                <button
                  type="button"
                  disabled={isOutOfStock || !hasMockupAreas}
                  onClick={() => handleCustomizingChange(true)}
                  className={`flex flex-col items-start p-3 border rounded-sm transition-all duration-200 text-left ${
                    isOutOfStock || !hasMockupAreas
                      ? "border-stone-150 bg-stone-50/50 text-stone-400 cursor-not-allowed opacity-50"
                      : isCustomizing
                      ? "border-stone-900 bg-white ring-1 ring-stone-900 shadow-sm cursor-pointer"
                      : "border-stone-200 bg-white/40 hover:border-stone-400 hover:bg-white cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isOutOfStock || !hasMockupAreas ? "border-stone-200" : isCustomizing ? "border-stone-900" : "border-stone-300"
                    }`}>
                      {!(isOutOfStock || !hasMockupAreas) && isCustomizing && <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />}
                    </span>
                    <span className={`text-xs font-bold flex items-center gap-1 ${isOutOfStock || !hasMockupAreas ? "text-stone-300/80" : "text-stone-900"}`}>
                      Custom Cetak Logo
                      <Sparkles className={`w-3 h-3 ${isOutOfStock || !hasMockupAreas ? "text-stone-300" : "text-[#C4A48E]"}`} />
                    </span>
                  </div>
                  <span className={`text-[10px] leading-normal font-normal ${isOutOfStock || !hasMockupAreas ? "text-stone-400" : "text-stone-500"}`}>
                    {!hasMockupAreas
                      ? "Kustom belum dikonfigurasi admin."
                      : "Tambahkan logo Anda sendiri ke produk."}
                  </span>
                </button>
              </div>
            </div>
          )}

          {attributeGroups.length > 0 ? (
            <div className="flex flex-col gap-4">
              {attributeGroups
                .filter((group) => !group.parentValueId || selectedAttributeValueIds.includes(group.parentValueId))
                .map((group) => {
                const isColorAttr =
                  group.type === "COLOR" ||
                  group.name.toLowerCase() === "warna" ||
                  group.name.toLowerCase() === "color";

                if (isColorAttr) {
                  const activeVal = selections[group.name] || "";
                  const isCustomActive = activeVal.startsWith("#");

                  const activeParsed = parseClientColorValue(activeVal);
                  let activeDisplayName = activeParsed.name || activeParsed.hex;

                  return (
                    <div key={group.name} className="mt-1 space-y-2">
                      <p className="text-sm font-medium text-stone-900">
                        Pilih {group.name}:{" "}
                        <span className="font-bold text-stone-600 capitalize">
                          {activeVal.startsWith("#") ? "Custom Color" : activeDisplayName}
                        </span>
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        {group.values.map((val) => {
                          const isSelected = selections[group.name] === val;
                          const isDisabled = isOptionDisabled(group.name, val);

                          const parsedColor = parseClientColorValue(val);
                          const colorInfo = {
                            hex: parsedColor.hex,
                            cmyk: parsedColor.cmyk,
                            name: parsedColor.name || parsedColor.hex
                          };

                          return (
                            <button
                              key={val}
                              type="button"
                              disabled={isDisabled}
                              onClick={() => handleSelectOption(group.name, val)}
                              className={`relative w-8 h-8 rounded-full border transition-all duration-200 flex items-center justify-center ${
                                isSelected && !isDisabled
                                  ? "ring-2 ring-stone-950 ring-offset-2 scale-105"
                                  : "hover:scale-105"
                              } ${isDisabled ? "opacity-35 cursor-not-allowed" : "cursor-pointer"}`}
                              style={{ backgroundColor: colorInfo.hex }}
                              title={`${colorInfo.name} (${colorInfo.cmyk})`}
                            >
                              {isSelected && !isDisabled && (
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    colorInfo.hex.toLowerCase() === "#ffffff" ? "bg-black" : "bg-white"
                                  }`}
                                />
                              )}
                            </button>
                          );
                        })}

                        {/* Custom Free-Pick Color Option */}
                        <div className="relative flex items-center gap-2">
                          <button
                            type="button"
                            className={`relative w-8 h-8 rounded-full border bg-gradient-to-tr from-rose-400 via-emerald-400 to-indigo-400 flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer ${
                              isCustomActive ? "ring-2 ring-stone-950 ring-offset-2 scale-105" : ""
                            }`}
                            onClick={() => {
                              const picker = document.getElementById(`color-picker-${group.name}`);
                              picker?.click();
                            }}
                            title="Custom Free-Pick Color"
                          >
                            {isCustomActive && (
                              <span className="w-2 h-2 rounded-full bg-white shadow" />
                            )}
                          </button>

                          <input
                            id={`color-picker-${group.name}`}
                            type="color"
                            value={isCustomActive ? activeVal : "#3b82f6"}
                            onChange={(e) => {
                              const hexVal = e.target.value;
                              handleSelectOption(group.name, hexVal);
                            }}
                            className="absolute opacity-0 w-0 h-0 pointer-events-none"
                          />
                        </div>
                      </div>

                      {/* CMYK profile display */}
                      {(() => {
                        const parsed = parseClientColorValue(activeVal);
                        const cmykStr = parsed.cmyk;
                        const hexDisplay = parsed.hex.toUpperCase();

                        if (!cmykStr) return null;

                        return (
                          <div className="bg-stone-50 border border-stone-200/85 p-2 px-3 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-stone-700 animate-fade-in gap-1.5 max-w-sm">
                            <span className="font-bold text-[10px] text-stone-400 uppercase tracking-wider">
                              Profil Cetak:
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-sm">
                                {cmykStr}
                              </span>
                              <span className="bg-stone-200/80 text-stone-700 font-mono font-bold px-1.5 py-0.5 rounded-sm">
                                {hexDisplay}
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  );
                }

                return (
                  <div key={group.name} className="mt-1">
                    <p className="text-sm font-medium text-stone-900 mb-2">
                      Pilih {group.name}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.values.map((val) => {
                        const isSelected = selections[group.name] === val;
                        let isDisabled = isOptionDisabled(group.name, val);

                        const isSizeGroup = group.name.toLowerCase().includes("size") || group.name.toLowerCase().includes("kapasitas") || group.name.toLowerCase().includes("ukuran");
                        if (isCustomizing && isSizeGroup && !doesSizeHaveMockups(val)) {
                          isDisabled = true;
                        }

                        return (
                          <button
                            key={val}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => handleSelectOption(group.name, val)}
                            className={`px-4 py-2 border rounded-sm text-sm transition-all duration-200 ${
                              isSelected && !isDisabled
                                ? "border-stone-900 bg-stone-900 text-white cursor-default"
                                : isDisabled
                                ? "border-stone-100 bg-stone-50 text-stone-300 cursor-not-allowed opacity-50"
                                : "border-stone-200 text-stone-600 hover:border-stone-400 cursor-pointer"
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            product.variants && product.variants.length > 0 && (
              <div className="mt-1">
                <p className="text-sm font-medium text-stone-900 mb-2">
                  Pilih Varian:
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      disabled={(v.stock ?? 0) <= 0}
                      onClick={() => handleVariantSelect(v.id)}
                      className={`px-4 py-2 border rounded-sm text-sm transition-colors ${
                        selectedVariantId === v.id && (v.stock ?? 0) > 0
                          ? "border-stone-900 bg-stone-900 text-white cursor-default"
                          : (v.stock ?? 0) <= 0
                          ? "border-stone-100 bg-stone-50 text-stone-300 cursor-not-allowed opacity-50"
                          : "border-stone-200 text-stone-600 hover:border-stone-400 cursor-pointer"
                      }`}
                    >
                      {v.name} ({v.stock > 0 ? `${v.stock} pcs` : "Habis"})
                    </button>
                  ))}
                </div>
              </div>
            )
          )}

          {activeTiers.length > 0 && (
            <div className="mt-1">
              <PriceTierSelector
                tiers={activeTiers}
                selectedIndex={selectedTierIndex}
                onSelect={handleTierSelect}
              />
            </div>
          )}

          {/* Stock Display */}
          <div className="text-sm font-semibold text-stone-600 mt-2">
            {selectedVariant ? (
              selectedVariant.stock > 0 ? (
                <span className="text-emerald-600">Stok: {selectedVariant.stock} pcs</span>
              ) : product.isMadeByOrder ? (
                <span className="text-amber-600 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-xs">Pre-Order / Made by Order</span>
              ) : (
                <span className="text-red-500 font-bold">Stok Habis (Out of Stock)</span>
              )
            ) : (product.variants && product.variants.length > 0) ? (
              product.variants.every((v) => v.stock <= 0) ? (
                product.isMadeByOrder ? (
                  <span className="text-amber-600 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-xs">Pre-Order / Made by Order</span>
                ) : (
                  <span className="text-red-500 font-bold">Stok Habis (Out of Stock)</span>
                )
              ) : (
                <span className="text-stone-500">Pilih varian untuk melihat stok</span>
              )
            ) : (Number(product.stock) || 0) > 0 ? (
              <span className="text-emerald-600">Stok: {product.stock} pcs</span>
            ) : product.isMadeByOrder ? (
              <span className="text-amber-600 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-xs">Pre-Order / Made by Order</span>
            ) : (
              <span className="text-red-500 font-bold">Stok Habis (Out of Stock)</span>
            )}
          </div>

          <QuantitySelector
            quantity={quantity}
            min={minAllowedQty}
            disabled={isOutOfStock}
            onChange={setQuantity}
          />

          {/* Detail Rincian Harga */}
          {isCustomizing && activePrintFeesList.length > 0 && (
            <div className="mt-3 pt-3 border-t border-stone-200 text-xs space-y-1.5 text-stone-500">
              <div className="flex justify-between">
                <span>Harga Produk ({quantity} pcs)</span>
                <span className="font-semibold text-stone-700">Rp {(basePrice * quantity).toLocaleString("id-ID")}</span>
              </div>
              
              {activePrintFeesList.map((item, idx) => (
                <div key={idx} className="flex justify-between pl-3 text-[11px] text-stone-500">
                  <span className="list-item list-inside">{item.name} (+Rp {item.modifier.toLocaleString("id-ID")}/pcs)</span>
                  <span>+Rp {(item.modifier * quantity).toLocaleString("id-ID")}</span>
                </div>
              ))}
            </div>
          )}

          <div className="py-2 border-t border-stone-100 mt-2">
            <p className="text-lg font-bold text-stone-900">
              Total: Rp {(finalPrice * quantity).toLocaleString("id-ID")}
            </p>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex items-center justify-center gap-2 border border-stone-800 text-stone-800 text-sm font-medium px-5 py-2.5 rounded-sm transition-colors w-1/3 ${
                isOutOfStock
                  ? "opacity-40 cursor-not-allowed border-stone-300 text-stone-400 hover:bg-transparent"
                  : "hover:bg-stone-800 hover:text-white cursor-pointer"
              }`}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {isOutOfStock ? "Stok Habis" : "Add to Cart"}
            </button>
            <button
              onClick={handleOrderNow}
              disabled={isOutOfStock}
              className={`flex-1 text-white text-sm font-semibold px-5 py-2.5 rounded-sm transition-colors tracking-wide text-center ${
                isOutOfStock
                  ? "bg-stone-300 text-stone-500 cursor-not-allowed"
                  : "bg-stone-900 hover:bg-stone-800 cursor-pointer"
              }`}>
              {isOutOfStock ? "OUT OF STOCK" : "ORDER NOW"}
            </button>
          </div>

          <WhatsAppBanner
            whatsappNumber={adminWhatsApp}
            productName={product.name}
          />

          <ProductDescription
            description={product.description}
            weight={displayWeight}
            dimensions={displayDimensions}
            accessories={product.accessories}
          />
        </div>
      </div>
    </div>
  );
}
