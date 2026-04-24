import { Link } from "@/i18n/routing";

interface ArticleNavigationProps {
  prevArticle?: { title: string; href: string };
  nextArticle?: { title: string; href: string };
}

export function ArticleNavigation({
  prevArticle,
  nextArticle,
}: ArticleNavigationProps) {
  return (
    <div className="border-t border-stone-200 pt-6 mt-8">
      <div className="flex items-center justify-between gap-4">
        {/* Previous */}
        {prevArticle ? (
          <Link
            href={prevArticle.href}
            className="group flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span className="group-hover:underline underline-offset-2">
              {prevArticle.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {/* Next */}
        {nextArticle ? (
          <Link
            href={nextArticle.href}
            className="group flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors text-right">
            <span className="group-hover:underline underline-offset-2">
              {nextArticle.title}
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
