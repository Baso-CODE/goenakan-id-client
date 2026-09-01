import { BrandClient } from "@/app/types/brandClient.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function getClientLogos(): Promise<BrandClient[]> {
  try {
    const res = await fetch(`${apiUrl}/brand-clients/public`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["brand-clients"],
      },
    });

    const json = await res.json();

    if (json.success && json.data) {
      return json.data;
    }

    return [];
  } catch (error) {
    console.error("Gagal mengambil data client logos:", error);
    return [];
  }
}
