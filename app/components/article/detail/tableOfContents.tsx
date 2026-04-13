"use client";

import { TocItem } from "@/app/types/articles/articleDetail.type";
import { useEffect, useState } from "react";

interface TableOfContentsProps {
  content: string;
}

function extractToc(html: string): TocItem[] {
  if (typeof window === "undefined") return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const headings = doc.querySelectorAll("h1, h2, h3");
  return Array.from(headings).map((el, i) => ({
    id: el.id || `heading-${i}`,
    text: el.textContent ?? "",
    level: parseInt(el.tagName[1]),
  }));
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [open, setOpen] = useState(true);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    setToc(extractToc(content));
  }, [content]);

  // Highlight active heading on scroll
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll("h1[id], h2[id], h3[id]");
      let current = "";
      headings.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) current = el.id;
      });
      setActiveId(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!toc.length) return null;

  return (
    <div className="border border-stone-200 rounded-sm bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-100">
        <span className="text-xs font-semibold text-stone-700 tracking-wide">
          Daftar isi
        </span>
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
          {open ? "Close" : "Open"}
        </button>
      </div>

      {/* TOC Items */}
      {open && (
        <div className="px-4 py-3 flex flex-col gap-1.5">
          {toc.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`text-left text-xs leading-snug transition-colors hover:text-stone-800 ${
                item.level === 1 ? "pl-0" : item.level === 2 ? "pl-3" : "pl-6"
              } ${
                activeId === item.id
                  ? "text-stone-800 font-medium"
                  : "text-stone-500"
              }`}>
              {item.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
