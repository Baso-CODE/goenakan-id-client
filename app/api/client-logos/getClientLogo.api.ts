import { BrandClient } from "@/app/types/brandClient.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function getClientLogos(): Promise<BrandClient[]> {
  try {
    // Sesuaikan endpoint ini dengan rute backend kamu
    const res = await fetch(`${apiUrl}/brand-clients/public`, {
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
