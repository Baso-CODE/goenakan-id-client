import { BannerProduct } from "@/app/types/bannerProduct.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function getPublicBannersProduct(): Promise<BannerProduct[]> {
  try {
    const res = await fetch(`${apiUrl}/banners/public`, {
      method: "GET",
      next: { revalidate: 3600 },
    });

    const json = await res.json();

    if (json.success && json.data) {
      return json.data;
    }

    return [];
  } catch (error) {
    console.error("Gagal mengambil data banners:", error);
    return [];
  }
}
