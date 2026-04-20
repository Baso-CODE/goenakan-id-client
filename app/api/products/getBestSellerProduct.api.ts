import { BestSellerProduct } from "@/app/types/bestSellerProduct.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function getBestSellerProductsAPI(): Promise<BestSellerProduct[]> {
  try {
    const res = await fetch(`${apiUrl}/products/best-sellers`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch best seller products");

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    return [];
  }
}
