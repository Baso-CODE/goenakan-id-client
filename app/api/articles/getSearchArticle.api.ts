import { apiUrl } from "@/app/utils/ApiUrl";

// Fungsi untuk Artikel
export async function getSearchArticlesAPI(
  searchQuery: string,
  page: number = 1,
  locale: string = "id",
) {
  try {
    const res = await fetch(
      `${apiUrl}/articles/list?search=${encodeURIComponent(searchQuery)}&page=${page}&take=6&locale=${locale}`,
      { cache: "no-store" },
    );
    if (!res.ok) throw new Error("Failed to fetch articles");
    return await res.json();
  } catch (error) {
    console.error("Fetch articles error:", error);
    return { data: [], meta: { hasNext: false } };
  }
}
