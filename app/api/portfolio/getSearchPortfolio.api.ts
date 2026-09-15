import { apiUrl } from "@/app/utils/ApiUrl";

// Fungsi untuk Portofolio
export async function getSearchPortfoliosAPI(
  searchQuery: string,
  page: number = 1,
  locale: string = "id",
) {
  try {
    const res = await fetch(
      `${apiUrl}/portfolios/list?search=${encodeURIComponent(searchQuery)}&page=${page}&take=6&locale=${locale}`,
      { cache: "no-store" },
    );
    if (!res.ok) throw new Error("Failed to fetch portfolios");
    return await res.json();
  } catch (error) {
    console.error("Fetch portfolios error:", error);
    return { data: [], meta: { hasNext: false } };
  }
}
