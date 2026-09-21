import { PortfolioPublic } from "@/app/types/portfolioPublic.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function getPublicPortfolios(
  lang: string = "id",
): Promise<PortfolioPublic[]> {
  try {
    const res = await fetch(`${apiUrl}/portfolios/public?lang=${lang}`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["portfolios"],
      },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Gagal mengambil data portofolio:", error);
    return [];
  }
}
