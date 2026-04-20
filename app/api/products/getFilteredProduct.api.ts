import { FilterState } from "@/app/types/product.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function getFilteredProductsAPI(
  filters: FilterState,
  page: number = 1,
) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      take: "6", // PAGE_SIZE
    });

    // Add filters to params if they are not 'all'
    if (filters.category && filters.category !== "all")
      params.append("category", filters.category);
    if (filters.color && filters.color !== "all")
      params.append("color", filters.color);
    if (filters.size && filters.size !== "all")
      params.append("size", filters.size);
    if (filters.price && filters.price !== "all")
      params.append("price", filters.price);
    if (filters.availability && filters.availability !== "all")
      params.append("availability", filters.availability);
    if (filters.sort) params.append("sort", filters.sort);

    const res = await fetch(`${apiUrl}/products/public?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch products");

    return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return { data: [], meta: { hasNext: false } };
  }
}
