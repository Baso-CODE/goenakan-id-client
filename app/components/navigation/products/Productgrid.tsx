"use client";

import { Product } from "@/app/types/product.type";
import { ProductCard } from "./Productcard";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-stone-100 rounded-sm overflow-hidden animate-pulse">
      <div className="aspect-4/5 bg-stone-100" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-4 bg-stone-100 rounded w-3/4" />
        <div className="h-3 bg-stone-100 rounded w-1/2" />
        <div className="h-3 bg-stone-100 rounded w-2/3" />
        <div className="h-3 bg-stone-100 rounded w-1/4 mt-1" />
      </div>
    </div>
  );
}

export function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-stone-400 text-sm">No products found.</p>
        <p className="text-stone-300 text-xs mt-1">
          Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
