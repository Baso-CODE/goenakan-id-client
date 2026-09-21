import { HeroSlidePublic } from "@/app/types/hero.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function getPublicHeroSlides(): Promise<HeroSlidePublic[]> {
  try {
    // Sesuaikan endpoint backend kamu (contoh: /content/heros/public)
    const res = await fetch(`${apiUrl}/content/heros/public`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["hero-slides"],
      },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json.data || json;
  } catch (error) {
    console.error("Gagal mengambil data hero slides:", error);
    return [];
  }
}
