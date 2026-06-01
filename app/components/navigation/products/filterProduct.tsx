"use client";

import {
  getFilteredProductsAPI,
  getFilterOptionsAPI,
} from "@/app/api/products/getFilteredProduct.api";
import {
  DynamicFilterOptions,
  FilterState,
  Product,
} from "@/app/types/product.type";
import { useEffect, useState } from "react";
import { FilterBar } from "./Filterbar";
import { LoadMoreButton } from "./Loadmorebutton";
import { PageHeader } from "./Pageheader";
import { ProductGrid } from "./Productgrid";

// ✨ Tambahkan inisialisasi awal untuk anak dan cucu kategori
const DEFAULT_FILTERS: FilterState = {
  category: "all",
  itemCategory: "all",
  itemName: "all",
  minPrice: "",
  maxPrice: "",
  availability: "all",
  sort: "best_selling",
  attributes: {},
};

export default function FilterProduct() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [products, setProducts] = useState<Product[]>([]);

  const [filterOptions, setFilterOptions] = useState<DynamicFilterOptions>({
    categories: [],
    attributes: [],
  });

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      const options = await getFilterOptionsAPI();
      setFilterOptions(options);
    };
    fetchOptions();
  }, []);

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

  const handleFilterChange = (
    keyOrObj: keyof FilterState | Partial<FilterState>,
    value?: string,
  ) => {
    if (typeof keyOrObj === "object") {
      setFilters((prev) => ({ ...prev, ...keyOrObj }));
    } else {
      setFilters((prev) => {
        const newState = {
          ...prev,
          [keyOrObj as keyof FilterState]: value || "",
        };

        // ✨ LOGIKA RESET CASCADING:
        // Jika Category (Induk) diganti, reset anak dan cucunya
        if (keyOrObj === "category") {
          newState.itemCategory = "all";
          newState.itemName = "all";
        }
        // Jika Item Category (Anak) diganti, reset cucunya
        if (keyOrObj === "itemCategory") {
          newState.itemName = "all";
        }

        return newState;
      });
    }
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
      <PageHeader title="Our Product" />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-7">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            dynamicOptions={filterOptions}
          />
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
