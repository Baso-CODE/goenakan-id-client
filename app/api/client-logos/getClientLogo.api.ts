import { ClientLogo } from "@/app/types/clientLogo.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function getClientLogos(): Promise<ClientLogo[]> {
  try {
    // Sesuaikan endpoint ini dengan rute backend kamu
    const res = await fetch(`${apiUrl}/content/client-logos`, {
      method: "GET",
      // Tambahkan cache: "no-store" jika logo sering diupdate,
      // atau next: { revalidate: 3600 } untuk ISR (cache 1 jam)
    });

    const json = await res.json();

    if (json.success && json.data) {
      return json.data;
    }

    return [];
  } catch (error) {
    console.error("Gagal mengambil data client logos:", error);
    return [];
  }
}
