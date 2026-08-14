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
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FilterBar } from "./Filterbar";
import { LoadMoreButton } from "./Loadmorebutton";
import { PageHeader } from "./Pageheader";
import { ProductGrid } from "./Productgrid";

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

const getUserCountryFromCookie = (): string => {
  if (typeof document === "undefined") return "ID";

  const match = document.cookie.match(/(^|;)\s*USER_COUNTRY\s*=\s*([^;]+)/);
  return match ? match[2] : "ID";
};

export default function FilterProduct() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search") || "";

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    category: categoryParam || "all",
  }));

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
      const options = await getFilterOptionsAPI(locale);
      setFilterOptions(options);
    };
    fetchOptions();
  }, [locale]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);

      const userCountry = getUserCountryFromCookie();

      const result = await getFilteredProductsAPI(
        filters,
        1,
        searchParam,
        userCountry,
        locale,
      );

      setProducts(result.data);
      setHasMore(result.meta.hasNext);
      setPage(1);
      setIsLoading(false);
    };

    fetchInitialData();
  }, [filters, searchParam, locale]);

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

        if (keyOrObj === "category") {
          newState.itemCategory = "all";
          newState.itemName = "all";
        }
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

    const userCountry = getUserCountryFromCookie();

    const result = await getFilteredProductsAPI(
      filters,
      nextPage,
      searchParam,
      userCountry,
      locale,
    );

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
