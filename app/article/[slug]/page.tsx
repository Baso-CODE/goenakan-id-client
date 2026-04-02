import { ArticleDetailPage } from "@/app/components/article/detail/articleDetailPage";
import { DUMMY_ARTICLE_DETAIL } from "@/app/data/articleDetail.data";
import { notFound } from "next/navigation";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticleSlugPage({ params }: ArticlePageProps) {
  const { slug } = await params;

  const article =
    DUMMY_ARTICLE_DETAIL.slug === slug ? DUMMY_ARTICLE_DETAIL : null;

  if (!article) notFound();

  return <ArticleDetailPage article={article} />;
}
