import { getActiveBanners } from "@/app/api/articles/getActiveBanners.api";
import { ArticleBannerCarousel } from "@/app/components/article/articleBannerCarousel";
import { ArticleList } from "@/app/components/article/articlelist";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("articleTitle"),
    description: t("articleDescription"),
    openGraph: {
      title: t("articleTitle"),
      description: t("articleDescription"),
      type: "website",
    },
  };
}

export default async function AllArticle() {
  const banners = await getActiveBanners();

  return (
    <>
      {banners.length > 0 && (
        <ArticleBannerCarousel articles={banners} interval={5000} />
      )}
      <ArticleList />
    </>
  );
}
