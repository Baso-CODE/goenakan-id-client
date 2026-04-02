import { ArticleDetail } from "@/app/types/articleDetail.type";
import Image from "next/image";
import Link from "next/link";
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
  return (
    <div className="min-h-screen bg-white pt-28">
      <div className="max-w-7xl mx-auto px-4  py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-stone-600 mb-6 flex-wrap">
          <Link
            href="/article"
            className=" hover:text-stone-800 transition-colors te">
            Article
          </Link>
          <span>›</span>
          <Link
            href="/article"
            className=" hover:text-stone-800 transition-colors">
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
                By {article.author} &nbsp;|&nbsp; {article.date}
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
                Sumber:{" "}
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
              prevArticle={article.prevArticle}
              nextArticle={article.nextArticle}
            />
            <RelevantArticle currentArticleId={article.id} />
          </article>

          {/* ── Right: Sticky Sidebar ── */}
          <div className="hidden lg:block relative self-stretch">
            <StickyProductSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
