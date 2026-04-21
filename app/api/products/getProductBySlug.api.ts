import { ProductDetail } from "@/app/types/productDetail.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function getProductBySlugAPI(
  slug: string,
): Promise<ProductDetail | null> {
  try {
    const res = await fetch(`${apiUrl}/products/public/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch product details: ${res.status}`);
    }

    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Fetch Product Error:", error);
    return null;
  }
}
