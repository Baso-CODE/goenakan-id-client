import { ArticleBanner } from "@/app/components/article/articleBannerCarousel";
import { BannerItem } from "@/app/types/articles/bannerItem.type";
import { apiUrl } from "@/app/utils/ApiUrl";

export async function getActiveBanners(
  lang: "id" | "en" = "id",
): Promise<ArticleBanner[]> {
  try {
    const res = await fetch(`${apiUrl}/articles-banners/public?lang=${lang}`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: [`article-banners-${lang}`],
      },
    });

    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    const data = json.data || [];

    return data.map((item: BannerItem) => {
      const formattedDate = item.article?.publishedAt
        ? new Date(item.article.publishedAt).toLocaleDateString(
            lang === "en" ? "en-US" : "id-ID",
            {
              month: "long",
              day: "numeric",
              year: "numeric",
            },
          )
        : lang === "en"
          ? "Just now"
          : "Baru saja";

      return {
        id: item.id,

        tag:
          item.article?.category?.name || (lang === "en" ? "THE BLOG" : "BLOG"),

        title:
          item.article?.title ||
          (lang === "en" ? "Untitled Article" : "Artikel Tanpa Judul"),

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
