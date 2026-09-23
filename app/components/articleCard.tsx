import { ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface ArticleData {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  href: string;
}

interface ArticleCardProps {
  article: ArticleData;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={article.href}
      className="group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Container Gambar */}
      <div className="relative w-full aspect-4/3 overflow-hidden bg-stone-100 flex items-center justify-center">
        {/*  PENGKONDISIAN GAMBAR: Cek apakah article.image ada */}
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          /*  TAMPILAN JIKA TIDAK ADA GAMBAR */
          <div className="flex flex-col items-center justify-center text-stone-400 p-4">
            <ImageOff className="w-10 h-10 mb-2 stroke-[1.5]" />
            <span className="text-xs uppercase tracking-wider font-medium">
              No Image
            </span>
          </div>
        )}

        {/* Badge Kategori di atas gambar */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-700 rounded-sm">
          {article.category}
        </div>
      </div>

      {/* Container Konten */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs text-stone-400 mb-2 font-medium">
          {article.date}
        </span>
        <h3 className="text-lg font-bold text-stone-800 leading-tight mb-2 group-hover:text-[#b5956a] transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-stone-500 line-clamp-3 mb-4 flex-1">
          {article.excerpt}
        </p>

        {/* Teks "Read More" di bagian bawah */}
        <div className="mt-auto flex items-center text-xs font-bold text-[#b5956a] uppercase tracking-wide">
          Read More
          <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
