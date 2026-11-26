import { ProductDetail } from "@/app/types/productDetail.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function getProductBySlugAPI(
  slug: string,
  locale: string = "id",
  _country: string = "ID",
): Promise<ProductDetail | null> {
  try {
    const params = new URLSearchParams({
      country: "ID",
      lang: locale,
    });

    const res = await fetch(
      `${apiUrl}/products/public/${encodeURIComponent(slug)}?${params.toString()}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) return null;

    const json = await res.json();

    return json.data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
