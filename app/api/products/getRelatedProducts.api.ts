import { Product } from "@/app/types/product.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function getRelatedProductsAPI(slug: string): Promise<Product[]> {
  try {
    const res = await fetch(`${apiUrl}/products/public/${slug}/related`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch related products");

    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}
