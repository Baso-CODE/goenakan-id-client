"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "./PageHeader";
import { FilterBar } from "./FilterBar";
import { ProductGrid } from "./ProductGrid";
import { LoadMoreButton } from "./LoadMoreButton";
import { FilterState, Product } from "@/types/product";
import { MOCK_PRODUCTS } from "@/data/products";

const PAGE_SIZE = 6;

const DEFAULT_FILTERS: FilterState = {
  category: "STAINLESS STEEL",
  color: "all",
  size: "all",
  price: "all",
  availability: "all",
  sort: "best_selling",
};

interface ProductPageProps {
  initialProducts?: Product[];
}

export function ProductPage({
  initialProducts = MOCK_PRODUCTS,
}: ProductPageProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setVisibleCount(PAGE_SIZE); // reset pagination on filter change
  };

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (filters.color !== "all") {
      result = result.filter((p) => p.color === filters.color);
    }

    if (filters.size !== "all") {
      result = result.filter((p) => p.size === filters.size);
    }

    if (filters.availability !== "all") {
      result = result.filter((p) => p.availability === filters.availability);
    }

    if (filters.price !== "all") {
      result = result.filter((p) => {
        switch (filters.price) {
          case "under_20000":
            return p.bulkPrice < 20000;
          case "20000_50000":
            return p.bulkPrice >= 20000 && p.bulkPrice <= 50000;
          case "above_50000":
            return p.bulkPrice > 50000;
          default:
            return true;
        }
      });
    }

    switch (filters.sort) {
      case "newest":
        // sort by id desc as proxy
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case "price_asc":
        result.sort((a, b) => a.bulkPrice - b.bulkPrice);
        break;
      case "price_desc":
        result.sort((a, b) => b.bulkPrice - a.bulkPrice);
        break;
      case "best_selling":
      default:
        result.sort((a, b) => b.sold - a.sold);
        break;
    }

    return result;
  }, [initialProducts, filters]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate async loading
    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);
      setIsLoadingMore(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <PageHeader title="Our Product" brand="Bamboo" />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Filter Bar */}
        <div className="mb-7">
          <FilterBar filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {/* Product Grid */}
        <ProductGrid products={visibleProducts} />

        {/* Load More */}
        <LoadMoreButton
          onClick={handleLoadMore}
          isLoading={isLoadingMore}
          hasMore={hasMore}
        />
      </main>
    </div>
  );
}
