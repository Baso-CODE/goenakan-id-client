import { apiUrl } from "@/app/utils/ApiUrl";

export async function getArticleData(slug: string) {
  try {
    const res = await fetch(`${apiUrl}/articles/slug/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const responseData = await res.json();
    return responseData.data || responseData;
  } catch (error) {
    console.error("Gagal mengambil artikel:", error);
    return null;
  }
}
