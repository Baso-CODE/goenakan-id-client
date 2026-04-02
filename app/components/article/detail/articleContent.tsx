"use client";

import { useEffect, useRef } from "react";

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Add IDs to headings for TOC scrollspy
  useEffect(() => {
    if (!ref.current) return;
    const headings = ref.current.querySelectorAll("h1, h2, h3");
    headings.forEach((el, i) => {
      if (!el.id) el.id = `heading-${i}`;
    });
  }, [content]);

  return (
    <div
      ref={ref}
      className="prose prose-stone max-w-none
        prose-headings:font-semibold prose-headings:text-stone-800
        prose-h2:text-base prose-h2:mt-8 prose-h2:mb-3
        prose-p:text-sm prose-p:text-stone-600 prose-p:leading-relaxed prose-p:my-3
        prose-blockquote:border-l-2 prose-blockquote:border-stone-300
        prose-blockquote:bg-stone-50 prose-blockquote:px-4 prose-blockquote:py-2
        prose-blockquote:text-sm prose-blockquote:text-stone-500
        prose-blockquote:not-italic prose-blockquote:rounded-sm
        prose-img:rounded-sm prose-img:w-full
        prose-a:text-stone-700 prose-a:underline"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
