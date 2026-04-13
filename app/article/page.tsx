import { getActiveBanners } from "../api/articles/getActiveBanners.api";
import { ArticleBannerCarousel } from "../components/article/articleBannerCarousel";
import { ArticleList } from "../components/article/articlelist";

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
