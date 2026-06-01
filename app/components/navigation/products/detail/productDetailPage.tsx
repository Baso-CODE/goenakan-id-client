"use client";

import { useCartStore } from "@/app/store/useCartStore";
import { AddToCartPayload } from "@/app/types/itemCart/addToCartPayload.type";
import { MediaItem, ProductDetail } from "@/app/types/productDetail.type";
import { useRouter } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { PriceTierSelector } from "./priceTierSelector";
import { ProductDescription } from "./productDescription";
import { ProductImageGallery } from "./productImageGallery";
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

  // 1. Tentukan Varian Default
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants && product.variants.length > 0
      ? product.variants[0].id
      : null,
  );

  const selectedVariant = useMemo(() => {
    return product.variants?.find((v) => v.id === selectedVariantId);
  }, [product.variants, selectedVariantId]);

  // 2. Tentukan Price Tiers Aktif (Prioritas: Varian > Induk)
  const activeTiers = useMemo(() => {
    if (selectedVariant?.priceTiers && selectedVariant.priceTiers.length > 0) {
      return selectedVariant.priceTiers;
    }
    return product.priceTiers || [];
  }, [selectedVariant, product.priceTiers]);

  // 3. Pastikan quantity awal sinkron dengan tier saat komponen pertama kali dimuat
  const [quantity, setQuantity] = useState(() => {
    return activeTiers.length > 0 ? (activeTiers[0].minQty ?? 1) : 1;
  });

  // ✨ PERBAIKAN 1: Pindahkan logika useEffect ke dalam fungsi onClick varian
  const handleVariantSelect = (variantId: string) => {
    setSelectedVariantId(variantId);

    // Cari tahu tier mana yang akan aktif setelah varian ini dipilih
    const variant = product.variants?.find((v) => v.id === variantId);
    const newActiveTiers =
      variant?.priceTiers && variant.priceTiers.length > 0
        ? variant.priceTiers
        : product.priceTiers || [];

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

  // 5. Kalkulasi Harga Final yang Tepat
  const finalPrice = useMemo(() => {
    if (activeTiers && activeTiers.length > 0) {
      const tier = activeTiers[selectedTierIndex];
      return tier.pricePerPcs ?? 0;
    }
    if (selectedVariant?.price != null) {
      return selectedVariant.price;
    }
    return product.variants?.[0]?.price ?? 0;
  }, [activeTiers, selectedTierIndex, selectedVariant, product]);

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
          <ProductImageGallery
            media={activeGalleryMedia}
            productName={product.name}
          />
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

          {product.variants && product.variants.length > 0 && (
            <div className="mt-1">
              <p className="text-sm font-medium text-stone-900 mb-2">
                Pilih Varian:
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleVariantSelect(v.id)}
                    className={`px-4 py-2 border rounded-sm text-sm transition-colors ${
                      selectedVariantId === v.id
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-200 text-stone-600 hover:border-stone-400"
                    }`}>
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
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

          <QuantitySelector
            quantity={quantity}
            min={minAllowedQty}
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
              className="flex items-center justify-center gap-2 border border-stone-800 text-stone-800 text-sm font-medium px-5 py-2.5 rounded-sm hover:bg-stone-800 hover:text-white transition-colors cursor-pointer w-1/3">
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
              Add to Cart
            </button>
            <button
              onClick={handleOrderNow}
              className="flex-1 bg-stone-900 text-white text-sm font-semibold px-5 py-2.5 rounded-sm hover:bg-stone-800 transition-colors tracking-wide cursor-pointer text-center">
              ORDER NOW
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
