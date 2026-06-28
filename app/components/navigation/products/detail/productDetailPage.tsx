"use client";

import { useCartStore } from "@/app/store/useCartStore";
import { AddToCartPayload } from "@/app/types/itemCart/addToCartPayload.type";
import { MediaItem, ProductDetail } from "@/app/types/productDetail.type";
import { useRouter } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { useMemo, useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { PriceTierSelector } from "./priceTierSelector";
import { ProductDescription } from "./productDescription";
import { ProductImageGallery } from "./productImageGallery";
import { ProductCustomizer } from "./productCustomizer";
import { QuantitySelector } from "./quantitySelector";
import { ShareBar } from "./sharebar";
import { WhatsAppBanner } from "./whatsappBanner";

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
      }
    > = {};

    product.variants?.forEach((variant) => {
      variant.attributes?.forEach((attr) => {
        if (!groups[attr.name]) {
          groups[attr.name] = {
            values: new Set<string>(),
            attributePosition: (attr as any).attributePosition ?? 0,
            valuePositions: {},
          };
        }
        groups[attr.name].values.add(attr.value);
        groups[attr.name].valuePositions[attr.value] =
          (attr as any).valuePosition ?? 0;
      });
    });

    return Object.entries(groups)
      .map(([name, { values, attributePosition, valuePositions }]) => {
        const sortedValues = Array.from(values).sort((a, b) => {
          return (valuePositions[a] ?? 0) - (valuePositions[b] ?? 0);
        });
        return {
          name,
          values: sortedValues,
          attributePosition,
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

  // Track if current selection (or entire product) is out of stock
  const isOutOfStock = useMemo(() => {
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

    const baselinePrice = product.variants?.[0]?.price ?? baseTiers[0].pricePerPcs ?? 0;
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
      const baselinePrice = product.variants?.[0]?.price ?? product.priceTiers[0].pricePerPcs ?? 0;
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
          return;
        }

        // 1. Cek kecocokan posisi spesifik (misal: "Front Print" cocok dengan "Tampak Depan")
        const matchingZone = Object.values(customization.zones).find((z: any) => {
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
          const logoCount = matchingZone.logoCount || 1;
          totalModifier += (av.priceModifier ?? 0) * logoCount;
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
            valueName.includes("belakang");

          if (isPrintAttr && !specifiesPosition && totalLogosCount > 0) {
            // Kalikan modifier harga per logo dengan total logo yang diunggah
            totalModifier += (av.priceModifier ?? 0) * totalLogosCount;
          }
        }
      });
    }

    return totalModifier;
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

  const activeGalleryMedia = useMemo(() => {
    let currentMedia: MediaItem[] = [];
    if (selectedVariantId && product.variants) {
      const variant = product.variants.find((v) => v.id === selectedVariantId);
      if (variant && variant.images) {
        currentMedia = [...variant.images];
      }
    }
    currentMedia = [...currentMedia, ...(product.media || [])];
    return currentMedia;
  }, [selectedVariantId, product]);

  const handleAddToCart = async () => {
    const payload: AddToCartPayload = {
      id: product.id,
      name: product.name,
      price: finalPrice,
      image:
        selectedVariant?.images?.[0]?.url ||
        product.media?.[0]?.url ||
        "/images/products/demo-products.png",
      variantId: selectedVariantId,
      dimensions: selectedVariant?.dimensionsString || product.dimensions,
      weight: selectedVariant?.weightString || product.weight,
      materialType: product.materialType,
      rawWeight: selectedVariant?.rawWeight || product.rawWeight,
      width: selectedVariant?.width || product.width,
      height: selectedVariant?.height || product.height,
      length: selectedVariant?.length || product.length,
      customization: customization,
    };

    await addToCart(payload, quantity, token);
  };

  const handleOrderNow = async () => {
    await handleAddToCart();
    router.push("/checkout");
  };

  const displayWeight = selectedVariant
    ? selectedVariant.weightString
    : product.weight;
  const displayDimensions = selectedVariant
    ? selectedVariant.dimensionsString
    : product.dimensions;

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
              onChange={setCustomization}
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
                  disabled={isOutOfStock}
                  onClick={() => handleCustomizingChange(true)}
                  className={`flex flex-col items-start p-3 border rounded-sm transition-all duration-200 text-left ${
                    isOutOfStock
                      ? "border-stone-100 bg-stone-50 text-stone-300 cursor-not-allowed opacity-50"
                      : isCustomizing
                      ? "border-stone-900 bg-white ring-1 ring-stone-900 shadow-sm cursor-pointer"
                      : "border-stone-200 bg-white/40 hover:border-stone-400 hover:bg-white cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isOutOfStock ? "border-stone-200" : isCustomizing ? "border-stone-900" : "border-stone-300"
                    }`}>
                      {!isOutOfStock && isCustomizing && <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />}
                    </span>
                    <span className={`text-xs font-bold flex items-center gap-1 ${isOutOfStock ? "text-stone-300" : "text-stone-900"}`}>
                      Custom Cetak Logo
                      <Sparkles className={`w-3 h-3 ${isOutOfStock ? "text-stone-300" : "text-[#C4A48E]"}`} />
                    </span>
                  </div>
                  <span className={`text-[10px] leading-normal font-normal ${isOutOfStock ? "text-stone-300" : "text-stone-500"}`}>
                    Tambahkan logo Anda sendiri ke produk.
                  </span>
                </button>
              </div>
            </div>
          )}

          {attributeGroups.length > 0 ? (
            <div className="flex flex-col gap-4">
              {attributeGroups.map((group) => (
                <div key={group.name} className="mt-1">
                  <p className="text-sm font-medium text-stone-900 mb-2">
                    Pilih {group.name}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.values.map((val) => {
                      const isSelected = selections[group.name] === val;
                      const isDisabled = isOptionDisabled(group.name, val);
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
              ))}
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
              ) : (
                <span className="text-red-500 font-bold">Stok Habis (Out of Stock)</span>
              )
            ) : (product.variants && product.variants.length > 0) ? (
              product.variants.every((v) => v.stock <= 0) ? (
                <span className="text-red-500 font-bold">Stok Habis (Out of Stock)</span>
              ) : (
                <span className="text-stone-500">Pilih varian untuk melihat stok</span>
              )
            ) : (Number(product.stock) || 0) > 0 ? (
              <span className="text-emerald-600">Stok: {product.stock} pcs</span>
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

          <div className="py-2">
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
