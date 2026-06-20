import { ArticleDetail } from "@/app/types/articles/articleDetail.type";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl"; // ✨ IMPORT HOOK LOCALE
import Image from "next/image";
import { ArticleContent } from "./articleContent";
import { ArticleNavigation } from "./articleNavigation";
import { RelevantArticle } from "./relevantArticle";
import { ShareArticle } from "./shareArticle";
import { StickyProductSidebar } from "./stickyProductSidebar";
import { TableOfContents } from "./tableOfContents";

interface ArticleDetailPageProps {
  article: ArticleDetail;
}

export function ArticleDetailPage({ article }: ArticleDetailPageProps) {
  const locale = useLocale(); // ✨ DETEKSI BAHASA AKTIF

  // ✨ KAMUS TEKS STATIS
  const dict = {
    breadcrumbRoot: locale === "en" ? "Article" : "Artikel",
    by: locale === "en" ? "By" : "Oleh",
    source: locale === "en" ? "Source:" : "Sumber:",
  };

  return (
    <div className="min-h-screen bg-white pt-10">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-stone-600 mb-6 flex-wrap">
          <Link
            href="/article"
            className="hover:text-stone-800 transition-colors">
            {dict.breadcrumbRoot}
          </Link>
          <span>›</span>
          <Link
            href="/article"
            className="hover:text-stone-800 transition-colors">
            {article.category}
          </Link>
          <span>›</span>
          <span className="text-stone-600 line-clamp-1">{article.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4 items-start">
          {/* ── Left: Article ── */}
          <article className="flex flex-col gap-5 min-w-0">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-stone-900 leading-snug">
                {article.title}
              </h1>
              <p className="text-xs text-stone-500">
                {dict.by} {article.author} &nbsp;|&nbsp; {article.date}
              </p>
            </div>

            {/* Cover Image */}
            <div className="relative w-full aspect-video rounded-sm overflow-hidden bg-stone-100">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 70vw"
                priority
              />
            </div>

            {/* Table of Contents */}
            <TableOfContents content={article.content} />

            {/* Article Body */}
            <ArticleContent content={article.content} />

            {/* Source */}
            {article.source && (
              <p className="text-xs text-stone-400">
                {dict.source}{" "}
                <a
                  href={article.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-stone-600 transition-colors">
                  {article.source}
                </a>
              </p>
            )}

            {/* Share */}
            <ShareArticle title={article.title} />

            {/* Prev / Next */}
            <ArticleNavigation
              prevArticle={article.prevArticle ?? undefined}
              nextArticle={article.nextArticle ?? undefined}
            />
            <RelevantArticle
              currentArticleId={article.id}
              articles={article.relevantArticles}
            />
          </article>

          {/* ── Right: Sticky Sidebar ── */}
          <div className="hidden lg:block relative self-stretch">
            <StickyProductSidebar products={article.relatedProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}
