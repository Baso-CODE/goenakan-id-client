"use client";

import { useCartStore } from "@/app/store/useCartStore";
import { AddToCartPayload } from "@/app/types/itemCart/addToCartPayload.type";
import { MediaItem, ProductDetail } from "@/app/types/productDetail.type";
import { useRouter } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { useMemo, useState, useEffect, useCallback } from "react";
import { Sparkles, ZoomIn, X } from "lucide-react";
import { toast } from "sonner";
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

const isPrintRelatedAttribute = (type: string, name: string) => {
  const t = type?.toUpperCase() || "";
  const n = name?.toLowerCase() || "";
  const isPhysical =
    t === "COLOR" ||
    t === "SIZE" ||
    t === "MODEL_SHAPE" ||
    n.includes("warna") ||
    n.includes("color") ||
    n.includes("ukuran") ||
    n.includes("size") ||
    n.includes("kapasitas") ||
    n.includes("capacity") ||
    n.includes("model") ||
    n.includes("shape");

  return !isPhysical;
};

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
  const [selectedCustomColor, setSelectedCustomColor] = useState("#ffffff");
  const [selectedMockupPositions, setSelectedMockupPositions] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);

  const handleCustomizingChange = (val: boolean) => {
    setIsCustomizing(val);
    if (!val) {
      setCustomization((prev: any) => prev?.customColor ? { customColor: prev.customColor } : null);
      setSelectedMockupPositions([]);
      setSelections((prev) => {
        const next = { ...prev };
        attributeGroups.forEach((group) => {
          if (isPrintRelatedAttribute(group.type, group.name)) {
            delete next[group.name];
          }
        });

        // Find the variant matching the cleared selections (lowest price first)
        const variantAttrNames = new Set(product.variants?.[0]?.attributes?.map((a: any) => a.name) || []);
        const matchingVariants = product.variants?.filter((v) => {
          return Object.entries(next)
            .filter(([name]) => variantAttrNames.has(name))
            .every(([name, value]) => {
              const attr = v.attributes?.find((a) => a.name === name);
              const cleanVal = value?.split("|")[0]?.toLowerCase().trim();
              const cleanAttrVal = attr?.value?.split("|")[0]?.toLowerCase().trim();
              return cleanAttrVal === cleanVal;
            });
        }) || [];
        const variantMatch = matchingVariants.length > 0
          ? [...matchingVariants].sort((a, b) => (a.price ?? 0) - (b.price ?? 0))[0]
          : null;

        if (variantMatch) {
          setSelectedVariantId(variantMatch.id);
        }

        return next;
      });
    } else {
      // Auto-select first option for print-related attributes when custom logo print is activated
      setSelections((prev) => {
        const next = { ...prev };
        attributeGroups.forEach((group) => {
          if (isPrintRelatedAttribute(group.type, group.name)) {
            if (!next[group.name] && group.values.length > 0) {
              next[group.name] = group.values[0];
            }
          }
        });
        return next;
      });
    }
  };

  const handleCustomColorChange = (hex: string) => {
    setSelectedCustomColor(hex);
    setCustomization((prev: any) => ({
      ...(prev || {}),
      customColor: hex
    }));
  };



  // 1. Group unique attributes and values
  const attributeGroups = useMemo(() => {
    const groups: Record<
      string,
      {
        values: Set<string>;
        attributePosition: number;
        type: string;
        parentValueId: string | null;
      }
    > = {};

    product.attributeValues?.forEach((av: any) => {
      if (!groups[av.attributeName]) {
        groups[av.attributeName] = {
          values: new Set<string>(),
          attributePosition: av.attributePosition ?? 0,
          type: av.attributeType || "TEXT",
          parentValueId: av.parentValueId || null,
        };
      }
      groups[av.attributeName].values.add(av.value);
    });

    return Object.entries(groups)
      .map(([name, { values, attributePosition, type, parentValueId }]) => {
        return {
          name,
          values: Array.from(values),
          attributePosition,
          type,
          parentValueId,
        };
      })
      .sort((a, b) => a.attributePosition - b.attributePosition);
  }, [product.attributeValues]);

  // 2. Selection state tracking
  const [selections, setSelections] = useState<Record<string, string>>({});
 
  const availableMockupPositions = useMemo(() => {
    if (!product.media) return [];
 
    const selectedSizeVal = product.attributeValues?.find((av: any) => {
      if (av.attributeType !== "SIZE") return false;
      const selectVal = selections[av.attributeName];
      if (!selectVal) return false;
      const cleanSelected = selectVal.split("|")[0].toLowerCase().trim();
      const cleanVal = av.value.split("|")[0].toLowerCase().trim();
      return cleanSelected === cleanVal;
    });
 
    const sizeId = selectedSizeVal?.attributeValueId || null;
    const mockups = product.media.filter((img: any) => {
      const isMockup = img.mockupSideName || (img.mockupAreas && img.mockupAreas.length > 0);
      if (!isMockup) return false;
      return !img.attributeValueId || img.attributeValueId === sizeId;
    });
 
    const uniquePositionsMap: Record<string, { id: string; name: string; printPositionValueId: string | null }> = {};
    mockups.forEach((img: any) => {
      const posKey = img.printPositionValueId || img.mockupSideName || "Bebas";
      if (!uniquePositionsMap[posKey]) {
        uniquePositionsMap[posKey] = {
          id: img.id,
          name: img.mockupSideName || "Mockup Position",
          printPositionValueId: img.printPositionValueId || null,
        };
      }
    });
 
    return Object.values(uniquePositionsMap);
  }, [product.media, product.attributeValues, selections]);
 
  useEffect(() => {
    if (isCustomizing && availableMockupPositions.length > 0) {
      setSelectedMockupPositions((prev) => {
        if (prev.length === 0) {
          return availableMockupPositions.map((p) => p.printPositionValueId || p.name);
        }
        const validIds = new Set(availableMockupPositions.map((p) => p.printPositionValueId || p.name));
        const filtered = prev.filter((id) => validIds.has(id));
        return filtered.length > 0 ? filtered : [availableMockupPositions[0].printPositionValueId || availableMockupPositions[0].name];
      });
    }
  }, [isCustomizing, availableMockupPositions]);
 

  // 3. Tentukan Varian Default
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  // 4. Auto-select first in-stock variant attributes on mount
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const defaultVariant = product.variants.find((v) => (v.stock ?? 0) > 0) || product.variants[0];
      if (defaultVariant) {
        const initialSelections: Record<string, string> = {};
        defaultVariant.attributes?.forEach((attr) => {
          if (!isPrintRelatedAttribute(attr.type || "", attr.name)) {
            initialSelections[attr.name] = attr.value;
          }
        });
        setSelections(initialSelections);

        const variantAttrNames = new Set(product.variants?.[0]?.attributes?.map((a: any) => a.name) || []);
        const matchingVariants = product.variants?.filter((v) => {
          return Object.entries(initialSelections)
            .filter(([name]) => variantAttrNames.has(name))
            .every(([name, val]) => {
              const attr = v.attributes?.find((a) => a.name === name);
              const cleanVal = val?.split("|")[0]?.toLowerCase().trim();
              const cleanAttrVal = attr?.value?.split("|")[0]?.toLowerCase().trim();
              return cleanAttrVal === cleanVal;
            });
        }) || [];

        const variantMatch = matchingVariants.length > 0
          ? [...matchingVariants].sort((a, b) => (a.price ?? 0) - (b.price ?? 0))[0]
          : defaultVariant;

        setSelectedVariantId(variantMatch.id);
      }
    }
  }, [product.variants]);

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

  // 5. Availability matrix checker
  const isOptionDisabled = (attrName: string, value: string) => {
    const variantAttrNames = new Set(product.variants?.[0]?.attributes?.map((a: any) => a.name) || []);
    
    const isSizeAttr = attrName.toLowerCase().includes("ukuran") || attrName.toLowerCase().includes("size") || attrName.toLowerCase().includes("kapasitas") || attrName.toLowerCase().includes("capacity");
    if (isCustomizing && isSizeAttr) {
      const cleanValue = value.split("|")[0];
      if (!doesSizeHaveMockups(cleanValue)) {
        return true;
      }
    }

    if (variantAttrNames.size > 0 && !variantAttrNames.has(attrName)) {
      return false; // Custom options (non-variant-generating attributes) are never disabled
    }

    const simulated = { ...selections, [attrName]: value };
    const match = product.variants?.some((variant) => {
      const matchesAll = Object.entries(simulated)
        .filter(([name]) => variantAttrNames.has(name))
        .every(([name, val]) => {
          const attr = variant.attributes?.find((a) => a.name === name);
          const cleanVal = val?.split("|")[0]?.toLowerCase().trim();
          const cleanAttrVal = attr?.value?.split("|")[0]?.toLowerCase().trim();
          return cleanAttrVal === cleanVal;
        });
      return matchesAll && (product.isMadeByOrder || (variant.stock ?? 0) > 0);
    });
    return !match;
  };

  // 6. Click handler
  const handleSelectOption = (attrName: string, value: string) => {
    const nextSelections = { ...selections, [attrName]: value };
    setSelections(nextSelections);

    // If they chose a Custom Color, make sure customization gets updated with the color
    const isCustomVal = value.toLowerCase().includes("custom") || value.toLowerCase().includes("kustom");
    if (isCustomVal) {
      setCustomization((prev: any) => ({
        ...(prev || {}),
        customColor: selectedCustomColor
      }));
    } else {
      // If they chose a non-custom color, remove customColor from customization
      setCustomization((prev: any) => {
        if (!prev) return null;
        const next = { ...prev };
        delete next.customColor;
        return Object.keys(next).length > 0 ? next : null;
      });
    }

    // Find corresponding variant
    const variantAttrNames = new Set(product.variants?.[0]?.attributes?.map((a: any) => a.name) || []);
    const matchingVariants = product.variants?.filter((v) => {
      return Object.entries(nextSelections)
        .filter(([name]) => variantAttrNames.has(name))
        .every(([name, val]) => {
          const attr = v.attributes?.find((a) => a.name === name);
          const cleanVal = val?.split("|")[0]?.toLowerCase().trim();
          const cleanAttrVal = attr?.value?.split("|")[0]?.toLowerCase().trim();
          return cleanAttrVal === cleanVal;
        });
    }) || [];

    const variantMatch = matchingVariants.length > 0
      ? [...matchingVariants].sort((a, b) => (a.price ?? 0) - (b.price ?? 0))[0]
      : null;

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
    let totalModifier = 0;
    console.log("--- START PRICING CALCULATION ---");
    console.log("selections:", selections);
    console.log("isCustomizing:", isCustomizing);
    console.log("selectedMockupPositions:", selectedMockupPositions);
 
    const variantAttrNames = new Set(selectedVariant?.attributes?.map((a: any) => a.name) || []);
    console.log("variantAttrNames:", Array.from(variantAttrNames));
 
    if (product.attributeValues) {
      product.attributeValues.forEach((av: any) => {
        const valueName = av.value?.toLowerCase().trim();
        const attrName = av.attributeName?.toLowerCase().trim() || "";
        if (!valueName) return;
 
        // 1. Regular custom options (excluding print side and mockup side because we calculate them dynamically based on selected mockup positions)
        const isSkippedPrintAttr = av.attributeType === "PRINT_SIDE" || av.attributeType === "MOCKUP_SIDE";
        const isCustomOption = !variantAttrNames.has(av.attributeName);
 
        if (isCustomOption && !isSkippedPrintAttr) {
          const activeSelectedValue = selections[av.attributeName];
          if (activeSelectedValue) {
            const cleanSelected = activeSelectedValue.split("|")[0].toLowerCase().trim();
            const cleanValue = av.value.split("|")[0].toLowerCase().trim();
            if (cleanSelected === cleanValue) {
              totalModifier += (av.priceModifier ?? 0);
              console.log(`Matched custom option: ${av.attributeName} = ${av.value}. Adding priceModifier = ${av.priceModifier}. Running total = ${totalModifier}`);
            }
          }
        }
      });
 
      // 2. Add print-related modifiers based on selected mockup positions
      if (isCustomizing) {
        const selectedCount = selectedMockupPositions.length;
 

 
        // B. Add specific print position (MOCKUP_SIDE) modifiers (e.g. Lid modifier)
        selectedMockupPositions.forEach((posKey) => {
          const matchedPositionAttr = product.attributeValues?.find((av: any) => {
            if (av.attributeType !== "MOCKUP_SIDE") return false;
            if (av.attributeValueId && av.attributeValueId === posKey) return true;
            
            const cleanVal = av.value.toLowerCase().replace(/[^a-z0-9]/g, "");
            const cleanKey = posKey.toLowerCase().replace(/[^a-z0-9]/g, "");
            return cleanVal === cleanKey || cleanVal.includes(cleanKey) || cleanKey.includes(cleanVal);
          });
 
          if (matchedPositionAttr) {
            totalModifier += (matchedPositionAttr.priceModifier ?? 0);
            console.log(`Matched position modifier for ${posKey}: Adding priceModifier = ${matchedPositionAttr.priceModifier}. Running total = ${totalModifier}`);
          }
        });
      }
    }
 
    console.log("Final computed customOptionsPriceModifier =", totalModifier);
    console.log("--- END PRICING CALCULATION ---");
    return totalModifier;
  }, [isCustomizing, selectedMockupPositions, product.attributeValues, selections, selectedVariant]);

  const activePrintFeesList = useMemo(() => {
    if (!isCustomizing || !product.attributeValues) {
      return [];
    }
 
    const list: { name: string; modifier: number }[] = [];
 
    // 1. Add all selected custom options (excluding print-related ones)
    const variantAttrNames = new Set(selectedVariant?.attributes?.map((a: any) => a.name) || []);
    product.attributeValues.forEach((av: any) => {
      const isSkippedPrintAttr = av.attributeType === "PRINT_SIDE" || av.attributeType === "MOCKUP_SIDE";
      const isCustomOption = !variantAttrNames.has(av.attributeName);
 
      if (isCustomOption && !isSkippedPrintAttr) {
        const activeSelectedValue = selections[av.attributeName];
        if (activeSelectedValue) {
          const cleanSelected = activeSelectedValue.split("|")[0].toLowerCase().trim();
          const cleanValue = av.value.split("|")[0].toLowerCase().trim();
          if (cleanSelected === cleanValue) {
            if ((av.priceModifier ?? 0) > 0) {
              list.push({
                name: `${av.attributeName}: ${av.value.split("|")[0]}`,
                modifier: av.priceModifier,
              });
            }
          }
        }
      }
    });
 
    // 2. Add print-related modifiers based on selected mockup positions
    const selectedCount = selectedMockupPositions.length;
 

 
    // B. Add specific print position (MOCKUP_SIDE) modifiers (e.g. Lid modifier)
    selectedMockupPositions.forEach((posKey) => {
      const matchedPositionAttr = product.attributeValues?.find((av: any) => {
        if (av.attributeType !== "MOCKUP_SIDE") return false;
        if (av.attributeValueId && av.attributeValueId === posKey) return true;
        
        const cleanVal = av.value.toLowerCase().replace(/[^a-z0-9]/g, "");
        const cleanKey = posKey.toLowerCase().replace(/[^a-z0-9]/g, "");
        return cleanVal === cleanKey || cleanVal.includes(cleanKey) || cleanKey.includes(cleanVal);
      });
 
      if (matchedPositionAttr) {
        if ((matchedPositionAttr.priceModifier ?? 0) > 0) {
          list.push({
            name: `${matchedPositionAttr.attributeName}: ${matchedPositionAttr.value.split("|")[0]}`,
            modifier: matchedPositionAttr.priceModifier,
          });
        }
      }
    });
 
    return list;
  }, [isCustomizing, selectedMockupPositions, product.attributeValues, selections, selectedVariant]);

  // 5. Kalkulasi Harga Final yang Tepat
  const basePrice = useMemo(() => {
    let price = 0;
    if (activeTiers && activeTiers.length > 0) {
      const tier = activeTiers[selectedTierIndex];
      price = tier.pricePerPcs ?? 0;
    } else if (selectedVariant?.price != null) {
      price = selectedVariant.price;
    } else {
      price = product.variants?.[0]?.price ?? 0;
    }

    // If Beli Polosan is selected, subtract any print-related attribute price modifiers
    // that are baked into the selected variant's attributes (for variant-generating attributes)
    if (!isCustomizing && selectedVariant && selectedVariant.attributes && product.attributeValues) {
      selectedVariant.attributes.forEach((attr: any) => {
        const match = product.attributeValues?.find((av: any) => {
          if (av.attributeValueId && attr.attributeValueId) {
            return av.attributeValueId === attr.attributeValueId;
          }
          const cleanAv = av.value?.split("|")[0]?.toLowerCase().trim();
          const cleanAttr = attr.value?.split("|")[0]?.toLowerCase().trim();
          return av.attributeName === attr.name && cleanAv === cleanAttr;
        });
        if (match) {
          const type = match.attributeType || "";
          const name = match.attributeName || "";
          if (isPrintRelatedAttribute(type, name)) {
            price -= (match.priceModifier ?? 0);
            console.log(`Beli Polosan active: Subtracting print modifier ${match.priceModifier} for attribute ${attr.name}=${attr.value}. New base price = ${price}`);
          }
        }
      });
    }

    return price;
  }, [activeTiers, selectedTierIndex, selectedVariant, product, isCustomizing]);

  const finalPrice = basePrice + customOptionsPriceModifier;

  // ✨ PERBAIKAN 3: Cukup ubah quantity, dan selectedTierIndex akan otomatis mengikuti
  const handleTierSelect = (index: number) => {
    const min = activeTiers[index]?.minQty ?? 1;
    setQuantity(min);
  };

  const adminWhatsApp = "6282387902238";

  // Order media: featured video, featured photo, non-featured photos, non-featured videos
  const sortMediaItems = (items: MediaItem[]): MediaItem[] => {
    const getMediaScore = (item: MediaItem): number => {
      const isFeatured = !!item.isFeatured;
      const isVideo = item.type === "video";

      if (isVideo && isFeatured) return 0;   // 1. Featured video
      if (!isVideo && isFeatured) return 1;  // 2. Featured photo
      if (!isVideo && !isFeatured) return 2; // 3. Non-featured photos
      return 3;                              // 4. Non-featured videos
    };

    return [...items].sort((a, b) => getMediaScore(a) - getMediaScore(b));
  };

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

    const mergedMedia = [...currentMedia, ...productMedia];
    return sortMediaItems(mergedMedia);
  }, [selectedVariantId, product, selectedAttributeValueIds]);

  const activeGalleryMedia = useMemo(() => {
    if (isCustomizing) {
      // Hanya tampilkan gambar yang memiliki area mockup kustom
      return allGalleryMediaForSize.filter((img) => img.mockupAreas && img.mockupAreas.length > 0);
    } else {
      // Tampilkan semua gambar tanpa filter ukuran (polosan type)
      const currentMedia = (selectedVariantId && product.variants)
        ? (product.variants.find((v) => v.id === selectedVariantId)?.images || [])
        : [];
      const productMedia = product.media || [];
      const mergedMedia = [...currentMedia, ...productMedia];
      return sortMediaItems(mergedMedia);
    }
  }, [allGalleryMediaForSize, isCustomizing, product.media, product.variants, selectedVariantId]);

  const customizerMedia = useMemo(() => {
    if (!isCustomizing) return activeGalleryMedia;
    return activeGalleryMedia.filter((item: any) => {
      const posKey = item.printPositionValueId || item.mockupSideName;
      if (!posKey) return true;
      return selectedMockupPositions.includes(posKey);
    });
  }, [activeGalleryMedia, isCustomizing, selectedMockupPositions]);

  const hasMockupAreas = useMemo(() => {
    const result = allGalleryMediaForSize.some((m) => m.mockupAreas && m.mockupAreas.length > 0);
    console.log("DEBUG: hasMockupAreas check on allGalleryMediaForSize =", result);
    return result;
  }, [allGalleryMediaForSize]);
 
  useEffect(() => {
    if (isCustomizing && !hasMockupAreas) {
      handleCustomizingChange(false);
      toast.error("Ukuran yang dipilih tidak mendukung kustomisasi cetak logo.");
    }
  }, [hasMockupAreas, isCustomizing]);



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

    const variantAttrNames = new Set(selectedVariant?.attributes?.map((a: any) => a.name) || []);
    const customOptions = Object.entries(selections)
      .filter(([name]) => !variantAttrNames.has(name))
      .reduce((acc, [name, val]) => {
        acc[name] = val.split("|")[0]; // Store clean value name (e.g. "Engraved")
        return acc;
      }, {} as Record<string, string>);
 
    if (isCustomizing) {
      const selectedCount = selectedMockupPositions.length;
      const printSideAttr = product.attributeValues?.find((av: any) => av.attributeType === "PRINT_SIDE");
      if (printSideAttr) {
        const matchedVal = product.attributeValues?.find((av: any) => av.attributeType === "PRINT_SIDE" && (parseInt(av.value) || 1) === selectedCount);
        if (matchedVal) {
          customOptions[printSideAttr.attributeName] = matchedVal.value.split("|")[0];
        }
      }
 
      const positionAttr = product.attributeValues?.find((av: any) => av.attributeType === "MOCKUP_SIDE");
      if (positionAttr) {
        const matchedNames = selectedMockupPositions.map((posKey) => {
          const match = product.attributeValues?.find((av: any) => {
            if (av.attributeType !== "MOCKUP_SIDE") return false;
            return av.attributeValueId === posKey || av.value === posKey;
          });
          return match ? match.value.split("|")[0] : posKey;
        });
        if (matchedNames.length > 0) {
          customOptions[positionAttr.attributeName] = matchedNames.join(", ");
        }
      }
    }

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
      customization: customization || Object.keys(customOptions).length > 0 ? {
        ...(customization || {}),
        selectedOptions: customOptions,
      } : null,
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
              media={customizerMedia}
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

          {isCustomizing && availableMockupPositions.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-md p-4 space-y-3 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Pilih Sisi / Posisi Cetak
              </p>
              <p className="text-[11px] text-stone-500 leading-normal">
                Pilih satu atau lebih sisi tempat Anda ingin mencetak logo. Setiap penambahan sisi akan otomatis memperbarui harga.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {availableMockupPositions.map((pos) => {
                  const posKey = pos.printPositionValueId || pos.name;
                  const isChecked = selectedMockupPositions.includes(posKey);
                  return (
                    <button
                      key={posKey}
                      type="button"
                      onClick={() => {
                        setSelectedMockupPositions((prev) => {
                          if (prev.includes(posKey)) {
                            if (prev.length <= 1) {
                              toast.error("Harap pilih minimal satu posisi cetak!");
                              return prev;
                            }
                            return prev.filter((p) => p !== posKey);
                          } else {
                            return [...prev, posKey];
                          }
                        });
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 ${
                        isChecked
                          ? "border-stone-900 bg-stone-900 text-white shadow-xs animate-scaleIn"
                          : "border-stone-200 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        isChecked ? "bg-white" : "bg-stone-300"
                      }`} />
                      {pos.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
 
          {attributeGroups.length > 0 ? (
            <div className="flex flex-col gap-4">
              {attributeGroups
                .filter((group) => {
                  if (group.parentValueId && !selectedAttributeValueIds.includes(group.parentValueId)) {
                    return false;
                  }
                  if (group.type === "MOCKUP_SIDE") {
                    return false;
                  }
                  if (group.type === "PRINT_SIDE") {
                    return false;
                  }
                  if (isPrintRelatedAttribute(group.type, group.name) && !isCustomizing) {
                    return false;
                  }
                  return true;
                })
                .map((group) => {
                const isColorAttr =
                  group.type === "COLOR" ||
                  group.name.toLowerCase() === "warna" ||
                  group.name.toLowerCase() === "color";

                if (isColorAttr) {
                  const activeVal = selections[group.name] || "";
                  const isCustomValSelected = activeVal.toLowerCase().includes("custom") || activeVal.toLowerCase().includes("kustom");

                  const activeParsed = parseClientColorValue(activeVal);
                  let activeDisplayName = activeParsed.name || activeParsed.hex;
                  if (isCustomValSelected) {
                    activeDisplayName = `${activeParsed.name} (${selectedCustomColor.toUpperCase()})`;
                  }

                  return (
                    <div key={group.name} className="mt-1 space-y-2">
                      <p className="text-sm font-medium text-stone-900">
                        Pilih {group.name}:{" "}
                        <span className="font-bold text-stone-600 capitalize">
                          {activeDisplayName}
                        </span>
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        {group.values.map((val) => {
                          const isSelected = selections[group.name] === val;
                          const isDisabled = isOptionDisabled(group.name, val);

                          const parsedColor = parseClientColorValue(val);
                          const isValCustom = val.toLowerCase().includes("custom") || val.toLowerCase().includes("kustom");

                          const colorInfo = {
                            hex: isValCustom ? selectedCustomColor : parsedColor.hex,
                            cmyk: parsedColor.cmyk,
                            name: parsedColor.name || parsedColor.hex
                          };

                          const bgStyle = isValCustom && !isSelected
                            ? { backgroundImage: "linear-gradient(to bottom right, #ff7e5f, #feb47b, #86e3ce, #d0e1fd, #e186e3)" }
                            : { backgroundColor: colorInfo.hex };

                          const colorButton = (
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
                              style={bgStyle}
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

                          if (isValCustom) {
                            return (
                              <div key={val} className="flex items-center gap-2 bg-gradient-to-r from-indigo-50/70 to-purple-50/40 border border-indigo-100 rounded-full pl-0.5 pr-2.5 py-0.5 shadow-2xs select-none animate-pulse">
                                {colorButton}
                                <span className="text-[9px] font-extrabold text-indigo-700 uppercase tracking-widest leading-none">
                                  🌈 Bisa Custom Warna
                                </span>
                              </div>
                            );
                          }

                          return colorButton;
                        })}
                      </div>

                      {/* Custom Color Picker Input (only show if Custom Color is selected) */}
                      {isCustomValSelected && (
                        <div className="mt-3 p-3 bg-stone-50 border border-stone-200 rounded-sm flex flex-col gap-2 max-w-sm animate-fade-in">
                          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                            Pilih Warna Kustom Anda:
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={selectedCustomColor}
                              onChange={(e) => handleCustomColorChange(e.target.value)}
                              className="w-10 h-10 rounded border border-stone-300 cursor-pointer p-0 bg-transparent"
                            />
                            <div className="flex-1 flex flex-col gap-1">
                              <input
                                type="text"
                                value={selectedCustomColor.toUpperCase()}
                                onChange={(e) => {
                                  const hex = e.target.value;
                                  if (/^#[0-9A-F]{6}$/i.test(hex)) {
                                    handleCustomColorChange(hex);
                                  }
                                }}
                                className="w-full text-xs px-2.5 py-2 border rounded-sm bg-white text-stone-800 uppercase font-mono font-bold"
                                placeholder="#FFFFFF"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CMYK profile display */}
                      {(() => {
                        const parsed = parseClientColorValue(activeVal);
                        const cmykStr = isCustomValSelected
                          ? `C: ${hexToCmyk(selectedCustomColor).c} | M: ${hexToCmyk(selectedCustomColor).m} | Y: ${hexToCmyk(selectedCustomColor).y} | K: ${hexToCmyk(selectedCustomColor).k}`
                          : parsed.cmyk;
                        const hexDisplay = isCustomValSelected ? selectedCustomColor.toUpperCase() : parsed.hex.toUpperCase();

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

                const isModelShapeAttr =
                  group.type === "MODEL_SHAPE" ||
                  group.name.toLowerCase() === "model" ||
                  group.name.toLowerCase() === "shape" ||
                  group.name.toLowerCase().includes("model") ||
                  group.name.toLowerCase().includes("shape");

                if (isModelShapeAttr) {
                  return (
                    <div key={group.name} className="mt-1">
                      <p className="text-sm font-medium text-stone-900 mb-2">
                        Pilih {group.name}:
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {group.values.map((val) => {
                          const isSelected = selections[group.name] === val;
                          let isDisabled = isOptionDisabled(group.name, val);

                          const p = val.split("|");
                          const mName = p[0] || "";
                          const mUrl = p[1] || "";

                          return (
                            <button
                              key={val}
                              type="button"
                              disabled={isDisabled}
                              onClick={() => handleSelectOption(group.name, val)}
                              className={`flex flex-col items-center justify-center p-2 border rounded-sm transition-all duration-200 min-w-[70px] ${
                                isSelected && !isDisabled
                                  ? "border-stone-850 ring-1 ring-stone-900 bg-stone-50 scale-102"
                                  : isDisabled
                                  ? "border-stone-100 bg-stone-50 text-stone-300 cursor-not-allowed opacity-50"
                                  : "border-stone-200 text-stone-600 hover:border-stone-400 cursor-pointer bg-white"
                              }`}
                            >
                              {mUrl ? (
                                <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-white mb-1 border border-stone-100 flex items-center justify-center group/thumb">
                                  <img
                                    src={mUrl}
                                    alt={mName}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPreviewImage({ url: mUrl, name: mName });
                                    }}
                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-150 flex items-center justify-center text-white"
                                    title="Perbesar gambar"
                                  >
                                    <ZoomIn className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-sm bg-stone-100 mb-1 border border-stone-200 flex items-center justify-center text-stone-400 text-xs">
                                  No Img
                                </div>
                              )}
                              <span className={`text-[11px] px-1 text-center font-semibold tracking-tight ${
                                isSelected && !isDisabled ? "text-stone-900" : "text-stone-600"
                              }`}>
                                {mName}
                              </span>
                            </button>
                          );
                        })}
                      </div>
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
                            {val.includes("|") ? val.split("|")[0] : val}
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
                      disabled={!product.isMadeByOrder && (v.stock ?? 0) <= 0}
                      onClick={() => handleVariantSelect(v.id)}
                      className={`px-4 py-2 border rounded-sm text-sm transition-colors ${
                        selectedVariantId === v.id
                          ? "border-stone-900 bg-stone-900 text-white cursor-default"
                          : (!product.isMadeByOrder && (v.stock ?? 0) <= 0)
                          ? "border-stone-100 bg-stone-50 text-stone-300 cursor-not-allowed opacity-50"
                          : "border-stone-200 text-stone-600 hover:border-stone-400 cursor-pointer"
                      }`}
                    >
                      {v.name} ({product.isMadeByOrder ? "Pre-Order" : (v.stock > 0 ? `${v.stock} pcs` : "Habis")})
                    </button>
                  ))}
                </div>
              </div>
            )
          )}

          {activeTiers.length > 0 && (
            <div className="mt-1">
              <PriceTierSelector
                tiers={activeTiers.map((t) => ({
                  ...t,
                  pricePerPcs: (t.pricePerPcs ?? 0) + customOptionsPriceModifier,
                }))}
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

      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-4 max-w-lg w-full flex flex-col items-center gap-3 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="w-full aspect-square rounded-md overflow-hidden bg-stone-50 flex items-center justify-center border border-stone-100 dark:border-stone-800">
              <img
                src={previewImage.url}
                alt={previewImage.name}
                className="w-full h-full object-contain"
              />
            </div>
            
            <p className="text-sm font-bold text-stone-900 dark:text-white capitalize">
              {previewImage.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
