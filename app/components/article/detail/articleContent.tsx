"use client";

import { useEffect, useRef } from "react";

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  const cleanHtml = (html: string): string => {
    if (!html) return "";

    return html
      .replace(/src="[^"]*lazy\.svg"/g, "")
      .replace(/data-src=/g, "src=")
      .replace(/class="[^"]*wp-[^"]*"/g, 'class="article-image"')
      .replace(/class="[^"]*is-resized[^"]*"/g, 'class="article-image"')
      .replace(/>\s+</g, "><");
  };

  const processedContent = cleanHtml(content);

  useEffect(() => {
    if (!ref.current) return;

    const headings = ref.current.querySelectorAll("h1, h2, h3");

    headings.forEach((element, index) => {
      if (!element.id) {
        element.id = `heading-${index}`;
      }
    });
  }, [processedContent]);

  return (
    <div className="w-full min-w-0 bg-white">
      <div
        ref={ref}
        className="
          article-richtext
          prose prose-stone
          w-full max-w-none min-w-0

          text-[14px]
          sm:text-[15px]
          lg:text-[16px]

          prose-headings:font-bold
          prose-headings:text-stone-900
          prose-headings:tracking-tight
          prose-headings:leading-[1.3]
          prose-headings:scroll-mt-28

          prose-h1:text-[22px]
          sm:prose-h1:text-[26px]
          prose-h1:mt-8
          prose-h1:mb-4

          prose-h2:text-[20px]
          sm:prose-h2:text-[24px]
          prose-h2:mt-8
          prose-h2:mb-3
          prose-h2:border-0
          prose-h2:pb-0

          prose-h3:text-[18px]
          sm:prose-h3:text-[20px]
          prose-h3:mt-6
          prose-h3:mb-3

          prose-h4:text-[16px]
          sm:prose-h4:text-[18px]
          prose-h4:mt-5
          prose-h4:mb-2

          prose-h5:text-[15px]
          sm:prose-h5:text-[16px]
          prose-h5:mt-4
          prose-h5:mb-2

          prose-h6:text-[14px]
          sm:prose-h6:text-[15px]
          prose-h6:mt-4
          prose-h6:mb-2

          prose-p:text-[14px]
          sm:prose-p:text-[15px]
          lg:prose-p:text-[16px]
          prose-p:font-normal
          prose-p:leading-[1.85]
          prose-p:text-stone-700
          prose-p:my-4

          prose-strong:font-bold
          prose-strong:text-stone-900

          prose-ul:my-4
          prose-ul:pl-6
          prose-ul:list-disc

          prose-ol:my-4
          prose-ol:pl-6
          prose-ol:list-decimal

          prose-li:text-[14px]
          sm:prose-li:text-[15px]
          lg:prose-li:text-[16px]
          prose-li:leading-[1.8]
          prose-li:text-stone-700
          prose-li:my-1

          prose-a:text-blue-600
          prose-a:underline
          prose-a:underline-offset-2

          prose-blockquote:text-[14px]
          sm:prose-blockquote:text-[15px]
          lg:prose-blockquote:text-[16px]
          prose-blockquote:font-normal
          prose-blockquote:leading-relaxed

          prose-figure:my-5
          prose-figure:mx-0
          prose-figure:max-w-full

          [&_img]:max-w-full
          [&_img]:h-auto
          [&_img]:rounded-lg
          [&_img]:object-contain

          [&_figure_img]:my-0

          prose-figcaption:text-[12px]
          sm:prose-figcaption:text-[13px]
          prose-figcaption:text-stone-500
          prose-figcaption:text-center
          prose-figcaption:leading-relaxed
          prose-figcaption:mt-2

          prose-table:text-[13px]
          sm:prose-table:text-[14px]
          prose-th:font-semibold
          prose-th:text-stone-900
          prose-td:text-stone-700

          [&_pre]:max-w-full
          [&_pre]:overflow-x-auto
        "
        dangerouslySetInnerHTML={{
          __html: processedContent,
        }}
      />
    </div>
  );
}
