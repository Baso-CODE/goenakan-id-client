import { FaqItem } from "@/app/types/faqLanding.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function getLandingFaqs(): Promise<FaqItem[]> {
  try {
    const res = await fetch(`${apiUrl}/content/faqs/public/landing?take=5`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["landing-faqs"],
      },
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
