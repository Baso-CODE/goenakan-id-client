// services/categoryService.ts

import { CategoryPublic } from "@/app/types/categoryProduct.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export const getCategoryList = async (): Promise<CategoryPublic[]> => {
  try {
    const res = await fetch(`${apiUrl}/product-categories/list`);

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
