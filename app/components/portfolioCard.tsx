import { ImageOff } from "lucide-react";
import Image from "next/image";

export interface PortfolioData {
  id: string;
  title: string;
  clientName: string;
  image: string;
}

interface PortfolioCardProps {
  item: PortfolioData;
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  return (
    // Jika portofolio bisa diklik, gunakan Link. Jika hanya pajangan, ganti Link dengan div
    <div className="group cursor-pointer flex flex-col w-full h-full">
      {/* Container Gambar (Rasio 4:5 sesuai desain awalmu) */}
      <div className="relative aspect-4/5 w-full bg-stone-200 overflow-hidden mb-4 rounded-md flex items-center justify-center">
        {/*  PENGKONDISIAN GAMBAR: Cek apakah item.image ada */}
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          /*  TAMPILAN JIKA TIDAK ADA GAMBAR */
          <div className="flex flex-col items-center justify-center text-stone-400 p-4 z-10">
            <ImageOff className="w-10 h-10 mb-2 stroke-[1.5]" />
            <span className="text-xs uppercase tracking-wider font-medium">
              No Image
            </span>
          </div>
        )}

        {/* Overlay hitam tipis saat di-hover */}
        {/* z-20 ditambahkan agar overlay tetap berada di atas teks "No Image" */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-20" />
      </div>

      {/* Container Teks */}
      <div className="text-center mt-auto">
        <h3 className="text-lg font-bold text-stone-900 uppercase tracking-wide">
          {item.title}
        </h3>
        <p className="text-sm text-stone-500 italic mt-1">
          for{" "}
          <span className="font-medium text-stone-700">{item.clientName}</span>
        </p>
      </div>
    </div>
  );
}
