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
import { useEffect, useRef, useState, useTransition } from "react";
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

const getFiltersFromUrl = (params: URLSearchParams): FilterState => {
  let attributes: Record<string, string> = {};

  try {
    const raw = params.get("attributes");

    if (raw) {
      const parsed = JSON.parse(raw);

      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        attributes = Object.fromEntries(
          Object.entries(parsed).filter(
            (entry): entry is [string, string] => typeof entry[1] === "string",
          ),
        );
      }
    }
  } catch {
    attributes = {};
  }

  return {
    ...DEFAULT_FILTERS,
    category: params.get("category") || "all",
    itemCategory: params.get("itemCategory") || "all",
    itemName: params.get("itemName") || "all",
    minPrice: params.get("minPrice") || "",
    maxPrice: params.get("maxPrice") || "",
    availability: params.get("availability") || "all",
    sort: params.get("sort") || "best_selling",
    attributes,
  };
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

  const isLoadMoreRef = useRef(false);

  const queryString = searchParams.toString();

  const searchParam = searchParams.get("search") || "";

  const pageParam = Math.max(1, Number(searchParams.get("page")) || 1);

  const [filters, setFilters] = useState<FilterState>(() =>
    getFiltersFromUrl(new URLSearchParams(queryString)),
  );

  // Sinkronkan filter saat URL berubah,
  // termasuk refresh, Back, Forward, dan link dari client.
  useEffect(() => {
    const updatedFilters = getFiltersFromUrl(new URLSearchParams(queryString));

    setFilters((previous) => {
      if (JSON.stringify(previous) === JSON.stringify(updatedFilters)) {
        return previous;
      }

      return updatedFilters;
    });
  }, [queryString]);

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

  // Handle Fetch data dari Page 1 sampai Page aktif saat ini
  useEffect(() => {
    const fetchProductsData = async () => {
      //  2. Jika URL berubah karena tombol Load More, batalkan fetch ulang ini!
      if (isLoadMoreRef.current) {
        isLoadMoreRef.current = false; // Turunkan kembali benderanya
        return;
      }

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

    params.set("page", String(newPage));

    const setFilterParam = (
      key: string,
      value?: string,
      defaultValue = "all",
    ) => {
      if (value && value !== defaultValue) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    };

    // Kategori utama
    setFilterParam("category", newFilters.category);

    // Item Category
    setFilterParam("itemCategory", newFilters.itemCategory);

    // Item Name
    setFilterParam("itemName", newFilters.itemName);

    // Harga
    setFilterParam("minPrice", newFilters.minPrice, "");

    setFilterParam("maxPrice", newFilters.maxPrice, "");

    // Ketersediaan
    setFilterParam("availability", newFilters.availability);

    // Urutan produk
    setFilterParam("sort", newFilters.sort, "best_selling");

    // Atribut tambahan
    const attributes = Object.fromEntries(
      Object.entries(newFilters.attributes || {}).filter(
        ([, value]) => value !== "" && value !== "all",
      ),
    );

    if (Object.keys(attributes).length > 0) {
      params.set("attributes", JSON.stringify(attributes));
    } else {
      params.delete("attributes");
    }

    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  };

  const handleFilterChange = (
    keyOrObj: keyof FilterState | Partial<FilterState>,
    value?: string,
  ) => {
    //  3. Pastikan flag dimatikan jika user mengubah filter agar loading screen muncul kembali
    isLoadMoreRef.current = false;

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

    isLoadMoreRef.current = true;
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
