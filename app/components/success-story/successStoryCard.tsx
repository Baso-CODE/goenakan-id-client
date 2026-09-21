import Image from "next/image";
import Link from "next/link";

export interface SuccessStoryData {
  id: string;
  slug: string;
  clientName: string;
  title: string;
  heroImageUrl: string;
  createdAt: string;
}

interface SuccessStoryCardProps {
  story: SuccessStoryData;
}

export function SuccessStoryCard({ story }: SuccessStoryCardProps) {
  const formattedDate = new Date(story.createdAt).toLocaleDateString("id-ID", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/success-story/${story.slug}`} // Link menuju halaman detail
      className="group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Container Gambar */}
      <div className="relative w-full aspect-4/3 overflow-hidden bg-stone-100">
        <Image
          src={story.heroImageUrl || "/images/placeholder.jpg"}
          alt={story.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Badge Klien di atas gambar */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-700 rounded-sm">
          {story.clientName}
        </div>
      </div>

      {/* Container Konten */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs text-stone-400 mb-2 font-medium">
          {formattedDate}
        </span>
        <h3 className="text-lg font-bold text-stone-800 leading-tight mb-4 group-hover:text-[#b5956a] transition-colors line-clamp-3 flex-1">
          {story.title}
        </h3>

        {/* Teks "Read More" di bagian bawah */}
        <div className="mt-auto flex items-center text-xs font-bold text-[#b5956a] uppercase tracking-wide">
          Read Story
          <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
