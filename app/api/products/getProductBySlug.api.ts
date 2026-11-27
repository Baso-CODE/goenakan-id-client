import { ProductDetail } from "@/app/types/productDetail.type";
import { apiUrl } from "@/app/utils/ApiUrl";
import { getUserCountryFromCookie } from "@/lib/getUserCountryFromCookie";

export async function getProductBySlugAPI(
  slug: string,
  locale: string = "id",
  country: string = "ID",
): Promise<ProductDetail | null> {
  try {
    const userCountry =
      typeof window !== "undefined" ? getUserCountryFromCookie() : country;

    const params = new URLSearchParams({
      country: userCountry,
      lang: locale,
    });

    const res = await fetch(
      `${apiUrl}/products/public/${slug}?${params.toString()}`,
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
