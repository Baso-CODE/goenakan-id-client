import { getAttribution } from "@/app/lib/tracking/getAttribution";
import { ContactPayload } from "@/app/types/contactMessage.type";
import { apiUrl } from "@/app/utils/ApiUrl";

interface ContactMessageResponse {
  success: boolean;
  message?: string;
  data?: {
    id: number;
  };
}

export async function submitContactMessage(
  data: ContactPayload,
): Promise<number | null> {
  const attribution = await getAttribution();
  try {
    const res = await fetch(`${apiUrl}/contact-messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        attribution,
      }),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const result: ContactMessageResponse = await res.json();

    if (!result.success || !Number.isSafeInteger(result.data?.id)) {
      return null;
    }

    return result.data!.id;
  } catch (error) {
    console.error("Gagal mengirim contact message:", error);
    return null;
  }
}
