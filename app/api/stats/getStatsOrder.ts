import { WhoWeAreStats } from "@/app/types/stats.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function getWhoWeAreStats(): Promise<WhoWeAreStats | null> {
  try {
    const res = await fetch(`${apiUrl}/orders/stats/who-we-are`, {
      method: "GET",
      next: {
        revalidate: 3600,
        tags: ["who-we-are-stats"],
      },
    });

    if (!res.ok) {
      console.warn("Gagal mengambil data statistik, status:", res.status);
      return null;
    }

    const json = await res.json();

    return json.data || null;
  } catch (error) {
    console.error("Gagal mengambil data Who We Are stats:", error);
    return null;
  }
}
