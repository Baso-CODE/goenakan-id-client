import { getArticleData } from "@/app/api/articles/getArticleBySlug.api";
import { ArticleDetailPage } from "@/app/components/article/detail/articleDetailPage";
import { getLocale } from "next-intl/server"; // ✨ IMPORT SERVER LOCALE
import { notFound } from "next/navigation";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticleSlugPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const locale = await getLocale();

  const rawArticle = await getArticleData(slug);

  if (!rawArticle) {
    notFound();
  }

  const getTranslatedValue = (data: any, key: "title" | "content") => {
    if (locale === "en" && data[`${key}_en`]) {
      return data[`${key}_en`];
    }
    return data[`${key}_id`] || data[key] || "";
  };

  const mappedRelatedProducts =
    rawArticle.relatedProducts?.map((rp: any) => {
      const imageUrl =
        rp.product.images && rp.product.images.length > 0
          ? rp.product.images[0].url
          : "/images/products/demo-products.png";

      return {
        id: rp.product.id,
        name: rp.product.name, // Jika product punya name_en, bisa di-mapping di sini juga
        image: imageUrl,
        href: `/products/${rp.product.slug}`,
      };
    }) || [];

  const mappedRelevantArticles =
    rawArticle.relevantArticles?.map((rel: any) => {
      const relContent = getTranslatedValue(rel, "content");
      return {
        id: rel.id,
        title: getTranslatedValue(rel, "title"),
        href: `/article/${rel.slug}`,
        image: rel.coverImage,
        excerpt: relContent
          ? relContent.replace(/<[^>]*>?/gm, "").substring(0, 100) + "..."
          : "",
      };
    }) || [];

  const resolveNavNode = (node: any) => {
    if (!node) return undefined;
    return {
      title: getTranslatedValue(node, "title"),
      href: node.href || `/article/${node.slug}`,
    };
  };

  const article = {
    id: rawArticle.id,
    title: getTranslatedValue(rawArticle, "title"),
    category: rawArticle.category?.name || "Uncategorized",
    author: rawArticle.author?.name || "Admin",
    date: new Date(
      rawArticle.publishedAt || rawArticle.createdAt,
    ).toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    coverImage: rawArticle.coverImage,
    content: getTranslatedValue(rawArticle, "content"),
    source: rawArticle.source || undefined,
    prevArticle: resolveNavNode(rawArticle.prevArticle),
    nextArticle: resolveNavNode(rawArticle.nextArticle),
    relatedProducts: mappedRelatedProducts,
    relevantArticles: mappedRelevantArticles,
  };

  return <ArticleDetailPage article={article} />;
}
