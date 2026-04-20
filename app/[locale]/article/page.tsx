import { getActiveBanners } from "@/app/api/articles/getActiveBanners.api";
import { ArticleBannerCarousel } from "@/app/components/article/articleBannerCarousel";
import { ArticleList } from "@/app/components/article/articlelist";

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
