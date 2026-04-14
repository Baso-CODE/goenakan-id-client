import { FaqItem } from "@/app/types/faqLanding.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function getMainFaqs(): Promise<FaqItem[]> {
  try {
    const res = await fetch(`${apiUrl}/content/faqs/public/main?take=50`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Gagal mengambil data FAQ Utama:", error);
    return [];
  }
}
