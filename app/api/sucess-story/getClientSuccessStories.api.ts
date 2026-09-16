import { apiUrl } from "@/app/utils/ApiUrl";

export async function getClientSuccessStoriesAPI(
  clientId: string,
  locale: string = "id",
  page: number = 1,
) {
  try {
    const res = await fetch(
      `${apiUrl}/success-story/public/client/${clientId}?locale=${locale}&page=${page}`,
      {
        method: "GET",
        next: {
          revalidate: 300,
          tags: [`client-stories-${clientId}`],
        },
      },
    );

    if (!res.ok) {
      console.warn("Gagal mengambil data cerita klien, status:", res.status);
      return { data: [], meta: { hasNext: false } };
    }

    const json = await res.json();
    return json;
  } catch (error) {
    console.error("Error mengambil data cerita klien:", error);
    return { data: [], meta: { hasNext: false } };
  }
}
