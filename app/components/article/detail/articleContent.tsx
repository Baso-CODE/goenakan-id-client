"use client";

import { useEffect, useRef } from "react";

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  const cleanHtml = (html: string) => {
    if (!html) return "";
    return (
      html
        // ✨ STEP 1: Hapus lazy loading
        .replace(/src="[^"]*lazy\.svg"/g, "")
        .replace(/data-src=/g, "src=")

        // ✨ STEP 2: Hapus width/height attributes yang buat sizing aneh
        .replace(/width="\d+"/g, "")
        .replace(/height="\d+"/g, "")

        // ✨ STEP 3: Hapus SEMUA inline styles yang conflikt
        .replace(/style="[^"]*"/g, "")

        // ✨ STEP 4: Hapus WordPress-specific classes yang bikin styling aneh
        .replace(/class="[^"]*wp-[^"]*"/g, 'class="article-image"')
        .replace(/class="[^"]*is-resized[^"]*"/g, 'class="article-image"')
        .replace(/class="[^"]*size-full[^"]*"/g, 'class="article-image"')

        // ✨ STEP 5: Collapse whitespace di antara tag (penting!)
        .replace(/>\s+</g, "><")
        .replace(/(<figure[^>]*>)\s+/g, "$1")
        .replace(/\s+(<\/figure>)/g, "$1")
    );
  };

  const processedContent = cleanHtml(content);

  useEffect(() => {
    if (!ref.current) return;

    // ✨ STEP 6: Fix figure heights dengan JavaScript
    const figures = ref.current.querySelectorAll("figure");
    figures.forEach((fig) => {
      // Set figure ke block container yang flushable
      fig.style.display = "block";
      fig.style.margin = "1rem 0"; // 16px top/bottom
      fig.style.padding = "0";

      // Fix image inside
      const img = fig.querySelector("img");
      if (img) {
        img.style.display = "block";
        img.style.width = "100%";
        img.style.height = "auto";
        img.style.maxHeight = "none"; // Remove height constraints!
        img.style.maxWidth = "100%";
        img.style.margin = "0";
        img.style.borderRadius = "0.5rem";
      }

      // Fix figcaption
      const caption = fig.querySelector("figcaption");
      if (caption) {
        caption.style.marginTop = "0.5rem";
        caption.style.fontSize = "0.875rem";
        caption.style.color = "#78716c";
        caption.style.textAlign = "center";
      }
    });

    // ✨ STEP 7: ID untuk headings
    const headings = ref.current.querySelectorAll("h1, h2, h3");
    headings.forEach((el, i) => {
      if (!el.id) el.id = `heading-${i}`;
    });
  }, [processedContent]);

  return (
    <div className="w-full flex justify-start bg-white">
      <div
        ref={ref}
        className="
          prose prose-stone prose-sm md:prose-base 
          max-w-none w-full 
          
          /* Styling Paragraf - REDUCED MARGIN */
          prose-p:leading-relaxed prose-p:mb-4 prose-p:text-stone-600
          
          /* Styling Text Tebal */
          prose-strong:font-bold prose-strong:text-stone-900
          
          /* Styling Daftar */
          prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
          prose-li:my-1 prose-li:text-stone-600
          
          /* Styling Heading */
          prose-headings:text-stone-900 prose-headings:font-bold prose-headings:scroll-mt-28
          prose-h2:text-2xl prose-h2:border-b prose-h2:border-stone-200 prose-h2:pb-3 prose-h2:mt-6 prose-h2:mb-3
          prose-h3:text-lg prose-h3:mt-3 prose-h3:mb-2
          
          /* ✨ AGGRESSIVE Figure Override */
          prose-figure:my-0! prose-figure:mx-0! prose-figure:p-0! prose-figure:block!
          prose-img:my-0! prose-img:mx-0! prose-img:max-h-none! prose-img:h-auto! prose-img:w-full! prose-img:block!
          prose-figcaption:my-2! prose-figcaption:mx-0! prose-figcaption:p-0!
        "
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    </div>
  );
}
