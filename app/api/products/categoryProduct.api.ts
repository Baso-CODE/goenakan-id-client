import { CategoryPublic } from "@/app/types/categoryProduct.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function getPublicCategories(
  lang: string = "id",
): Promise<CategoryPublic[]> {
  try {
    const res = await fetch(
      `${apiUrl}/product-categories/public?lang=${lang}`,
      {
        next: {
          revalidate: 300,
        },
      },
    );

    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Gagal mengambil kategori:", error);
    return [];
  }
}
