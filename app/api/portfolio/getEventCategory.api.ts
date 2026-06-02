import { apiUrl } from "@/app/utils/ApiUrl";
import { EventCategory } from "../../types/eventCategory.type";

export async function getPublicEventCategories(): Promise<EventCategory[]> {
  try {
    const res = await fetch(`${apiUrl}/event-categories/public`, {
      method: "GET",
      next: { revalidate: 3600 },
    });

    const json = await res.json();

    if (json.success && json.data) {
      return json.data;
    }

    return [];
  } catch (error) {
    console.error("Gagal mengambil data event categories:", error);
    return [];
  }
}

export async function getPublicEventCategoryBySlug(
  slug: string,
): Promise<EventCategory | null> {
  try {
    const res = await fetch(`${apiUrl}/event-categories/public/${slug}`, {
      method: "GET",
      next: { revalidate: 3600 },
    });

    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    return null;
  } catch (error) {
    console.error(`Gagal mengambil data event category ${slug}:`, error);
    return null;
  }
}
