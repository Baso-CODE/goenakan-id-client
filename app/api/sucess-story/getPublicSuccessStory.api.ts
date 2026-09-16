import { apiUrl } from "@/app/utils/ApiUrl";

export async function getPublicSuccessStoriesAPI(
  locale: string = "id",
  page: number = 1,
) {
  try {
    const res = await fetch(
      `${apiUrl}/success-story/public?locale=${locale}&page=${page}`,
      {
        method: "GET",
        next: {
          revalidate: 300,
          tags: ["success-stories"],
        },
      },
    );

    if (!res.ok) {
      console.warn("Gagal mengambil data success stories, status:", res.status);
      return { data: [], meta: { hasNext: false } };
    }

    const json = await res.json();
    return json;
  } catch (error) {
    console.error("Error mengambil data success stories:", error);
    // Mengembalikan nilai default jika terjadi error (agar web tidak crash)
    return { data: [], meta: { hasNext: false } };
  }
}
