"use client";

import { getFilteredProductsAPI } from "@/app/api/products/getFilteredProduct.api";
import { FilterState, Product } from "@/app/types/product.type";
import { useEffect, useState } from "react";
import { FilterBar } from "./Filterbar";
import { LoadMoreButton } from "./Loadmorebutton";
import { PageHeader } from "./Pageheader";
import { ProductGrid } from "./Productgrid";

const DEFAULT_FILTERS: FilterState = {
  category: "all",
  color: "all",
  size: "all",
  price: "all",
  availability: "all",
  sort: "best_selling",
};

export default function FilterProduct() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [products, setProducts] = useState<Product[]>([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch data whenever filters change
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const result = await getFilteredProductsAPI(filters, 1);
      setProducts(result.data);
      setHasMore(result.meta.hasNext);
      setPage(1);
      setIsLoading(false);
    };

    fetchInitialData();
  }, [filters]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    const nextPage = page + 1;
    const result = await getFilteredProductsAPI(filters, nextPage);

    setProducts((prev) => [...prev, ...result.data]);
    setHasMore(result.meta.hasNext);
    setPage(nextPage);
    setIsLoadingMore(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <PageHeader title="Our Product" brand="Bamboo" />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-7">
          <FilterBar filters={filters} onFilterChange={handleFilterChange} />
        </div>

        <ProductGrid products={products} isLoading={isLoading} />

        {!isLoading && (
          <LoadMoreButton
            onClick={handleLoadMore}
            isLoading={isLoadingMore}
            hasMore={hasMore}
          />
        )}
      </main>
    </div>
  );
}
