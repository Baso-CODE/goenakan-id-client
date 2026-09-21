import { apiUrl } from "@/app/utils/ApiUrl";

export async function getDetailSuccessStoryAPI(
  slug: string,
  locale: string = "id",
) {
  try {
    const res = await fetch(
      `${apiUrl}/success-story/public/detail/${slug}?locale=${locale}`,
      {
        method: "GET",
        next: {
          revalidate: 300,
          tags: [`success-story-${slug}`],
        },
      },
    );

    if (!res.ok) {
      console.warn("Gagal mengambil data detail success story");
      return null;
    }

    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("Error mengambil detail success story:", error);
    return null;
  }
}
