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
      <div className="relative aspect-4/5 w-full bg-stone-200 overflow-hidden mb-4 rounded-md">
        <Image
          src={item.image || "/images/placeholder.jpg"}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Overlay hitam tipis saat di-hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
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
