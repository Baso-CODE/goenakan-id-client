"use client";

interface ShareArticleProps {
  title: string;
}

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
  },
  {
    label: "Tiktok",
    href: "https://tiktok.com",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
  },
  {
    label: "Threads",
    href: "https://threads.net",
  },
  {
    label: "X/Twitter",
    href: "https://twitter.com",
  },
  {
    label: "Youtube",
    href: "https://youtube.com",
  },
];

export function ShareArticle({ title }: ShareArticleProps) {
  const url = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="flex flex-col items-center gap-2 py-4 border-t border-stone-100 mt-4">
      <p className="text-base text-stone-600">Share Article</p>
      <div className="flex items-center gap-4 flex-wrap justify-center">
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={
              s.label === "X/Twitter"
                ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
                : s.href
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-stone-500 hover:text-stone-800 transition-colors">
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}
