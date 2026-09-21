import { apiUrl } from "@/app/utils/ApiUrl";
import { EventCategory } from "../../types/eventCategory.type";

export async function getPublicEventCategories(
  lang: string = "id",
): Promise<EventCategory[]> {
  try {
    const res = await fetch(`${apiUrl}/event-categories/public?lang=${lang}`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["event-categories"],
      },
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
  lang: string = "id",
): Promise<EventCategory | null> {
  try {
    const res = await fetch(
      `${apiUrl}/event-categories/public/${slug}?lang=${lang}`,
      {
        method: "GET",
        next: {
          revalidate: 300,
          tags: ["event-categories", `event-category-${slug}`],
        },
      },
    );

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

export async function getEventCategoryList(
  lang: string = "id",
): Promise<EventCategory[]> {
  try {
    // Memanggil endpoint /list dengan parameter bahasa
    const res = await fetch(`${apiUrl}/event-categories/list?lang=${lang}`, {
      method: "GET",
      next: {
        revalidate: 300, // ISR: Cache akan diperbarui setiap 5 menit
        tags: ["event-categories-list"],
      },
    });

    const json = await res.json();

    if (json.success && json.data) {
      return json.data;
    }

    return [];
  } catch (error) {
    console.error("Gagal mengambil data event categories list:", error);
    return [];
  }
}
