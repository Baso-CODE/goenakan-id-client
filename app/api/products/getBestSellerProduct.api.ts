import { BestSellerProduct } from "@/app/types/bestSellerProduct.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function getBestSellerProductsAPI(
  country: string = "ID",
  locale: string = "id",
): Promise<BestSellerProduct[]> {
  const params = new URLSearchParams({
    country: country.trim().toUpperCase() || "ID",
    lang: locale.trim().toLowerCase() || "id",
  });
  try {
    const response = await fetch(
      `${apiUrl}/products/best-sellers?${params.toString()}`,
      {
        method: "GET",
        next: {
          revalidate: 300,
          tags: ["best-sellers"],
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch best sellers: HTTP ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error("Invalid best seller response");
    }

    return result.data as BestSellerProduct[];
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    return [];
  }
}
