import { ArticleBannerCarousel } from "../components/article/articleBannerCarousel";
import { ArticleList } from "../components/article/articlelist";
import { DUMMY_ARTICLES } from "../data/article.data";

export default function AllArticle() {
  return (
    <>
      <ArticleBannerCarousel
        articles={[
          {
            id: "1",
            tag: "THE BLOG",
            title:
              "15 Ide Hampers Premium Korporat: Eksklusif dan Tepat untuk Klien VIP",
            date: "February 2, 2026",
            href: "/article/hampers-premium",
            image: "/images/article/banner-dummy.png",
          },
          // tambah artikel lainnya...
        ]}
        interval={5000}
      />
      <ArticleList articles={DUMMY_ARTICLES} />
    </>
  );
}
