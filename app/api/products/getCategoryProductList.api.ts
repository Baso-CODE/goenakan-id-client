import { CategoryPublic } from "@/app/types/categoryProduct.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export const getCategoryList = async (
  lang: string = "id",
): Promise<CategoryPublic[]> => {
  try {
    const res = await fetch(`${apiUrl}/product-categories/list?lang=${lang}`, {
      next: {
        revalidate: 300,
        tags: ["categories"],
      },
    });

    if (!res.ok) {
      throw new Error("Gagal mengambil data dari server");
    }

    const result = await res.json();
    return result.data || result;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
