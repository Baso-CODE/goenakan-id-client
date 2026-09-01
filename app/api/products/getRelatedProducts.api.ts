import { Product } from "@/app/types/product.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function getRelatedProductsAPI(slug: string): Promise<Product[]> {
  try {
    const res = await fetch(`${apiUrl}/products/public/${slug}/related`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["related-products", `related-${slug}`],
      },
    });

    if (!res.ok) throw new Error("Failed to fetch related products");

    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}
