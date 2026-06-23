import { BestPriceGuaranteeItem } from "@/app/types/bestPriceGuarantee.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function getBestPriceGuarantees(): Promise<
  BestPriceGuaranteeItem[]
> {
  try {
    const res = await fetch(
      `${apiUrl}/content/best-price-guarantee/public/main`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      console.error("Failed to fetch Best Price Guarantees:", res.statusText);
      return [];
    }

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Gagal mengambil data Best Price Guarantees:", error);
    return [];
  }
}
