import { ArticleBanner } from "@/app/components/article/articleBannerCarousel";
import { BannerItem } from "@/app/types/articles/bannerItem.type";

import { apiUrl } from "@/app/utils/ApiUrl";

export async function getActiveBanners(): Promise<ArticleBanner[]> {
  try {
    const res = await fetch(`${apiUrl}/articles-banners/public`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    const data = json.data || [];

    return data.map((item: BannerItem) => {
      const formattedDate = item.article?.publishedAt
        ? new Date(item.article.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "Baru saja";

      return {
        id: item.id,
        tag: item.article?.category?.name || "THE BLOG",
        title: item.article?.title || "Untitled Article",
        date: formattedDate,
        href: item.ctaLink || `/article/${item.article?.slug}`,
        image: item.article?.coverImage || "/images/article/banner-dummy.png",
        backgroundColor: item.backgroundColor,
        buttonText: item.buttonText,
      };
    });
  } catch (error) {
    console.error("Gagal mengambil data banner:", error);
    return [];
  }
}
