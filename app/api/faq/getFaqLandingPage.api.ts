import { FaqItem } from "@/app/types/faqLanding.type";
import { apiUrl } from "@/app/utils/ApiUrl";

// 2. TERAPKAN INTERFACE PADA FUNGSI FETCH
export async function getLandingFaqs(): Promise<FaqItem[]> {
  try {
    const res = await fetch(`${apiUrl}/content/faqs/public/landing?take=5`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Gagal mengambil data FAQ:", error);
    return [];
  }
}
