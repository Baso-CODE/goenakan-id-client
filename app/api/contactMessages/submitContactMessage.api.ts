import { ContactPayload } from "@/app/types/contactMessage.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function submitContactMessage(
  data: ContactPayload,
): Promise<boolean> {
  try {
    const res = await fetch(`${apiUrl}/contact-messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error("Gagal mengirim data ke server:", await res.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error jaringan saat mengirim pesan kontak:", error);
    return false;
  }
}
