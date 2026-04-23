// src/app/services/customerProfile.service.ts
import {
  CustomerProfile,
  UpdateProfilePayload,
} from "@/app/types/customerProfile.type";
import { WebOrder } from "@/app/types/webOrder.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function getMyProfile(
  token: string,
): Promise<CustomerProfile | null> {
  try {
    const res = await fetch(`${apiUrl}/customer-profile/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      console.error("Gagal mengambil profil:", json.message);
      return null;
    }

    return json.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

export async function updateMyProfile(
  token: string,
  data: UpdateProfilePayload,
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${apiUrl}/customer-profile/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    return {
      success: json.success || false,
      message: json.message || "Terjadi kesalahan saat update",
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: "Terjadi kesalahan jaringan" };
  }
}

export async function getMyOrders(token: string): Promise<WebOrder[]> {
  try {
    const res = await fetch(`${apiUrl}/web-orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      console.error("Gagal mengambil pesanan:", json.message);
      return [];
    }

    return json.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}
