import { apiUrl } from "@/app/utils/ApiUrl";

export type PublicAppSettings = {
  googleAnalyticsId: string | null;
  googleAnalyticsEnabled: boolean;

  googleAdsId: string | null;
  googleAdsEnabled: boolean;

  gtmId: string | null;
  gtmEnabled: boolean;

  googleSiteVerification: string | null;

  pixelId: string | null;
  pixelEnabled: boolean;

  microsoftClarityId: string | null;
  microsoftClarityEnabled: boolean;
};

const defaultSettings: PublicAppSettings = {
  googleAnalyticsId: null,
  googleAnalyticsEnabled: false,

  googleAdsId: null,
  googleAdsEnabled: false,

  gtmId: null,
  gtmEnabled: false,

  googleSiteVerification: null,

  pixelId: null,
  pixelEnabled: false,

  microsoftClarityId: null,
  microsoftClarityEnabled: false,
};

export async function getPublicAppSettings(): Promise<PublicAppSettings> {
  try {
    const res = await fetch(`${apiUrl}/app-settings`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["app-settings"],
      },
    });

    if (!res.ok) {
      return defaultSettings;
    }

    const json = await res.json();

    return {
      ...defaultSettings,
      ...(json.data || json),
    };
  } catch (error) {
    console.error("Gagal mengambil app settings:", error);

    return defaultSettings;
  }
}
