import { Product } from "@/app/types/product.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export type RelatedProduct = Pick<
  Product,
  "id" | "name" | "slug" | "image" | "bulkPrice" | "regularPrice"
> & {
  currencyCode: string;
  minOrder: number;
  isCustom: boolean;
};

export async function getRelatedProductsAPI(
  slug: string,
  country: string = "ID",
  lang: string = "id",
): Promise<RelatedProduct[]> {
  try {
    const params = new URLSearchParams({
      country: country.trim().toUpperCase() || "ID",
      lang: lang.trim().toLowerCase() || "id",
    });

    const response = await fetch(
      `${apiUrl}/products/public/${encodeURIComponent(slug)}/related?${params.toString()}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch related products: HTTP ${response.status}`,
      );
    }

    const result = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error("Invalid related products response");
    }

    return result.data as RelatedProduct[];
  } catch (error) {
    console.error("[RelatedProducts] Fetch error:", error);

    return [];
  }
}
