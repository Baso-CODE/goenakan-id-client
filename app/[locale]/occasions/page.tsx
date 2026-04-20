import { getTranslations } from "next-intl/server";
import Link from "next/link";

const portfolioCategories = [
  {
    id: "1",
    title: "Corporate, MICE, & Community.",
    orderCount: 47,
    slug: "corporate-mice-community",
    image: "/images/placeholder.jpg", // Ganti dengan path gambarmu nanti
  },
  {
    id: "2",
    title: "Wedding & Celebrations.",
    orderCount: 75,
    slug: "wedding-celebrations",
    image: "/images/placeholder.jpg",
  },
  {
    id: "3",
    title: "Hospitality & Amenities.",
    orderCount: 75,
    slug: "hospitality-amenities",
    image: "/images/placeholder.jpg",
  },
  {
    id: "4",
    title: "Sports & Wellness.",
    orderCount: 47,
    slug: "sports-wellness",
    image: "/images/placeholder.jpg",
  },
  {
    id: "5",
    title: "Eco-Friendly & Sustainability.",
    orderCount: 75,
    slug: "eco-friendly-sustainability",
    image: "/images/placeholder.jpg",
  },
  {
    id: "6",
    title: "Retail & Partnership.",
    orderCount: 75,
    slug: "retail-partnership",
    image: "/images/placeholder.jpg",
  },
];

export default async function OccasionsPage() {
  // Panggil translasi khusus untuk Server Component
  const t = await getTranslations("Occasions");

  return (
    <main className="w-full min-h-screen bg-white py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        {/* === Header Section === */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-16 mb-16">
          {/* Judul (Kiri) */}
          <h1 className="text-2xl md:text-2.8xl lg:text-[40px] font-normal text-gray-900 leading-tight lg:w-1/2">
            {t("title")}
          </h1>

          {/* Deskripsi (Kanan) */}
          <p className="text-base md:text-lg text-gray-800 leading-relaxed lg:w-1/2 lg:pt-3">
            {t("description")}
          </p>
        </div>

        {/* === Grid Section === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {portfolioCategories.map((category) => (
            <Link
              href={`/occasions/${category.slug}`}
              key={category.id}
              className="group block">
              <div className="flex flex-col items-center">
                {/* Kotak Gambar Placeholder (Warna Abu-abu seperti referensi) */}
                <div className="relative w-full aspect-square bg-[#E5E5E5] mb-5 overflow-hidden transition-all duration-300 group-hover:shadow-lg">
                  {/* Jika nanti sudah ada gambar, uncomment kodingan di bawah ini */}
                  {/* <Image 
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  /> 
                  */}
                </div>

                {/* Teks Judul Kategori */}
                <h3 className="text-lg md:text-xl font-normal text-gray-900 text-center mb-1 group-hover:text-[#C4A48E] transition-colors">
                  {category.title}
                </h3>

                {/* Teks Subtitle (Jumlah Pesanan) - Menggunakan fungsi dinamis dari next-intl */}
                <p className="text-sm italic text-gray-600 text-center">
                  {t("orderedTimes", { count: category.orderCount })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
