import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
          <Tooltip delayDuration={300}>
            {/* Gunakan div standar sebagai Trigger agar Ref berjalan lancar */}
            <TooltipTrigger asChild>
              <div className="flex w-full max-w-[45%] cursor-pointer items-center justify-start">
                <Link
                  href={prevArticle.href}
                  className="group flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors overflow-hidden">
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
                  <span className="truncate group-hover:underline underline-offset-2">
                    {prevArticle.title}
                  </span>
                </Link>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" align="start" className="max-w-[300px]">
              <p>{prevArticle.title}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="w-full max-w-[45%]" />
        )}

        {/* Next */}
        {nextArticle ? (
          <Tooltip delayDuration={300}>
            {/* Gunakan div standar sebagai Trigger agar Ref berjalan lancar */}
            <TooltipTrigger asChild>
              <div className="flex w-full max-w-[45%] cursor-pointer items-center justify-end">
                <Link
                  href={nextArticle.href}
                  className="group flex items-center justify-end gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors overflow-hidden text-right">
                  <span className="truncate group-hover:underline underline-offset-2">
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
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" align="end" className="max-w-[300px]">
              <p>{nextArticle.title}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="w-full max-w-[45%]" />
        )}
      </div>
    </div>
  );
}
