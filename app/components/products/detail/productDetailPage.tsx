"use client";

import { ProductDetail } from "@/app/products/types/productDetail.type";
import { useState } from "react";
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
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);
  const [quantity, setQuantity] = useState(product.priceTiers[0].minQty);

  const selectedTier = product.priceTiers[selectedTierIndex];

  const handleTierSelect = (index: number) => {
    setSelectedTierIndex(index);
    setQuantity(product.priceTiers[index].minQty);
  };

  const handleAddToCart = () => {
    console.log("Add to cart:", {
      product: product.id,
      quantity,
      tier: selectedTier,
    });
    // integrate with your cart logic
  };

  const handleOrderNow = () => {
    const message = encodeURIComponent(
      `Halo, saya ingin memesan:\n\nProduk: ${product.name}\nJumlah: ${quantity} pcs\nTier: ${selectedTier.label}\nHarga: IDR ${selectedTier.pricePerPcs.toLocaleString("id-ID")}/pcs\n\nMohon konfirmasinya, terima kasih!`,
    );
    window.open(
      `https://wa.me/${product.whatsappNumber}?text=${message}`,
      "_blank",
    );
  };

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* ── Left: Image Gallery ── */}
        <div className="flex flex-col gap-4">
          <ProductImageGallery
            images={product.images}
            productName={product.name}
          />
          <ShareBar productName={product.name} />
        </div>

        {/* ── Right: Product Info ── */}
        <div className="flex flex-col gap-5">
          {/* Category & Title */}
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

          {/* Price Tier Selector */}
          <div className="mt-1">
            <PriceTierSelector
              tiers={product.priceTiers}
              selectedIndex={selectedTierIndex}
              onSelect={handleTierSelect}
            />
          </div>

          {/* Quantity */}
          <QuantitySelector
            quantity={quantity}
            min={selectedTier.minQty}
            onChange={setQuantity}
          />

          {/* CTA Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 border border-stone-800 text-stone-800 text-sm font-medium px-5 py-2.5 rounded-sm hover:bg-stone-800 hover:text-white transition-colors">
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
              className="flex-1 bg-stone-900 text-white text-sm font-semibold px-5 py-2.5 rounded-sm hover:bg-stone-800 transition-colors tracking-wide">
              ORDER NOW
            </button>
          </div>

          {/* WhatsApp Banner */}
          <WhatsAppBanner
            whatsappNumber={product.whatsappNumber}
            productName={product.name}
          />

          {/* Description & Specs */}
          <ProductDescription
            description={product.description}
            weight={product.weight}
            dimensions={product.dimensions}
            accessories={product.accessories}
          />
        </div>
      </div>
    </div>
  );
}
