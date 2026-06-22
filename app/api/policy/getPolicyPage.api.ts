import { PolicyCategory } from "@/app/types/policy.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function getAllPolicies(): Promise<PolicyCategory[]> {
  try {
    const res = await fetch(`${apiUrl}/policies/public/all`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch policies:", res.statusText);
      return [];
    }

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Gagal mengambil data Policies:", error);
    return [];
  }
}
