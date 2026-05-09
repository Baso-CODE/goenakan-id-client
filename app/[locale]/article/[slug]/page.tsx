import { getArticleData } from "@/app/api/articles/getArticleBySlug.api";
import { ArticleDetailPage } from "@/app/components/article/detail/articleDetailPage";
import { RelevantArticle } from "@/app/types/articles/articleDetail.type";
import { RelatedProduct } from "@/app/types/articles/relatedProduct.type";
import { notFound } from "next/navigation";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticleSlugPage({ params }: ArticlePageProps) {
  const { slug } = await params;

  const rawArticle = await getArticleData(slug);

  if (!rawArticle) {
    notFound();
  }

  const mappedRelatedProducts =
    rawArticle.relatedProducts?.map((rp: RelatedProduct) => {
      const imageUrl =
        rp.product.images && rp.product.images.length > 0
          ? rp.product.images[0].url
          : "/images/products/demo-products.png";

      return {
        id: rp.product.id,
        name: rp.product.name,
        image: imageUrl,
        href: `/products/${rp.product.slug}`,
      };
    }) || [];
  const mappedRelevantArticles =
    rawArticle.relevantArticles?.map((rel: RelevantArticle) => ({
      id: rel.id,
      title: rel.title,
      href: `/article/${rel.slug}`,
      image: rel.coverImage,
      excerpt: rel.content
        ? rel.content.replace(/<[^>]*>?/gm, "").substring(0, 100) + "..."
        : "",
    })) || [];
  // Di dalam file page.tsx Anda
  const article = {
    id: rawArticle.id,
    title: rawArticle.title,
    category: rawArticle.category?.name || "Uncategorized",
    author: rawArticle.author?.name || "Admin",
    date: new Date(
      rawArticle.publishedAt || rawArticle.createdAt,
    ).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    coverImage: rawArticle.coverImage,
    content: rawArticle.content,
    source: rawArticle.source || undefined,
    prevArticle: rawArticle.prevArticle || undefined,
    nextArticle: rawArticle.nextArticle || undefined,
    relatedProducts: mappedRelatedProducts,
    relevantArticles: mappedRelevantArticles,
  };
  return <ArticleDetailPage article={article} />;
}
