import { PortfolioPublic } from "@/app/types/portfolioPublic.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function getPublicPortfolios(): Promise<PortfolioPublic[]> {
  try {
    const res = await fetch(`${apiUrl}/portfolios/public`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Gagal mengambil data portofolio:", error);
    return [];
  }
}
