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
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [_, startTransition] = useTransition();

  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search") || "";
  const pageParam = Number(searchParams.get("page")) || 1;

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    category: categoryParam || "all",
  }));

  const [products, setProducts] = useState<Product[]>([]);
  const [filterOptions, setFilterOptions] = useState<DynamicFilterOptions>({
    categories: [],
    attributes: [],
  });

  const [page, setPage] = useState(pageParam);
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

  // Handle Fetch data dari Page 1 sampai Page aktif saat ini (untuk merestore posisi load more)
  useEffect(() => {
    const fetchProductsData = async () => {
      setIsLoading(true);
      const userCountry = getUserCountryFromCookie();

      let accumulatedProducts: Product[] = [];
      let latestHasMore = false;

      for (let i = 1; i <= pageParam; i++) {
        const result = await getFilteredProductsAPI(
          filters,
          i,
          searchParam,
          userCountry,
          locale,
        );

        if (i === 1) {
          accumulatedProducts = result.data;
        } else {
          accumulatedProducts = [...accumulatedProducts, ...result.data];
        }
        latestHasMore = result.meta.hasNext;
      }

      setProducts(accumulatedProducts);
      setHasMore(latestHasMore);
      setPage(pageParam);
      setIsLoading(false);
    };

    fetchProductsData();
  }, [filters, searchParam, locale, pageParam]);

  const updateUrlParams = (newPage: number, newFilters: FilterState) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    if (newFilters.category && newFilters.category !== "all") {
      params.set("category", newFilters.category);
    } else {
      params.delete("category");
    }

    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  };

  const handleFilterChange = (
    keyOrObj: keyof FilterState | Partial<FilterState>,
    value?: string,
  ) => {
    let updatedFilters = filters;
    if (typeof keyOrObj === "object") {
      updatedFilters = { ...filters, ...keyOrObj };
      setFilters(updatedFilters);
    } else {
      updatedFilters = {
        ...filters,
        [keyOrObj as keyof FilterState]: value || "",
      };

      if (keyOrObj === "category") {
        updatedFilters.itemCategory = "all";
        updatedFilters.itemName = "all";
      }
      if (keyOrObj === "itemCategory") {
        updatedFilters.itemName = "all";
      }

      setFilters(updatedFilters);
    }
    // Reset ke page 1 jika filter berubah
    updateUrlParams(1, updatedFilters);
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

    // Update URL agar page saat ini tersimpan
    updateUrlParams(nextPage, filters);
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
