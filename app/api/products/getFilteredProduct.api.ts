import { FilterState } from "@/app/types/product.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function getFilteredProductsAPI(
  filters: FilterState,
  page: number = 1,
) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      take: "6",
    });

    if (filters.category && filters.category !== "all") {
      params.append("categoryId", filters.category);
    }
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
    if (filters.availability && filters.availability !== "all")
      params.append("availability", filters.availability);
    if (filters.sort) params.append("sort", filters.sort);

    // ✨ UBAH JSON ATTRIBUTES KE STRING LALU KIRIM
    if (filters.attributes && Object.keys(filters.attributes).length > 0) {
      params.append("attributes", JSON.stringify(filters.attributes));
    }

    const res = await fetch(`${apiUrl}/products/public?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return { data: [], meta: { hasNext: false } };
  }
}
// ... fungsi getFilterOptionsAPI di bawahnya biarkan saja

export async function getFilterOptionsAPI() {
  try {
    const res = await fetch(`${apiUrl}/products/public/filters`);
    if (!res.ok) throw new Error("Failed to fetch filter options");

    const result = await res.json();
    return result.data || result;
  } catch (error) {
    console.error("Fetch filter options error:", error);
    return { categories: [], colors: [], sizes: [] };
  }
}
