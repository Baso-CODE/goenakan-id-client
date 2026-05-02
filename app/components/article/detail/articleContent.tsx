"use client";

import { useEffect, useRef } from "react";

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Menambahkan ID ke heading untuk kebutuhan Table of Contents (TOC)
  useEffect(() => {
    if (!ref.current) return;
    const headings = ref.current.querySelectorAll("h1, h2, h3");
    headings.forEach((el, i) => {
      if (!el.id) el.id = `heading-${i}`;
    });
  }, [content]);

  return (
    <div className="w-full flex justify-start bg-white">
      <div
        ref={ref}
        className="
          prose prose-stone prose-sm md:prose-base 
          max-w-none w-full 
          
          /* Styling Paragraf: Jarak antar baris dan bawahnya */
          prose-p:leading-relaxed prose-p:mb-6 prose-p:text-stone-600
          
          /* Styling Text Tebal (Bawaan Tiptap <strong>) */
          prose-strong:font-bold prose-strong:text-stone-900
          
          /* Styling Daftar/List (Bawaan Tiptap <ul> dan <li>) */
          prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6
          prose-li:my-2 prose-li:text-stone-600
          
          /* Styling Heading */
          prose-headings:text-stone-900 prose-headings:font-bold prose-headings:scroll-mt-28
          prose-h2:text-2xl prose-h2:border-b prose-h2:border-stone-200 prose-h2:pb-3 prose-h2:mt-10
          
          /* Styling Gambar */
          prose-img:rounded-xl prose-img:shadow-md prose-img:my-8 prose-img:w-full prose-img:object-cover
        "
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
