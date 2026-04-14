import { CategoryPublic } from "@/app/types/categoryProduct.type";
import { apiUrl } from "@/app/utils/ApiUrl";

// 2. Fungsi untuk Fetch data dari API Public
export async function getPublicCategories(): Promise<CategoryPublic[]> {
  try {
    const res = await fetch(`${apiUrl}/product-categories/public`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Gagal mengambil kategori:", error);
    return [];
  }
}
