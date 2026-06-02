import { getPublicEventCategoryBySlug } from "@/app/api/portfolio/getEventCategory.api";
import Image from "next/image";
import { notFound } from "next/navigation";

// ✨ Definisi interface agar params ditangani sebagai Promise
interface OccasionPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function OccasionDetailPage({
  params,
}: OccasionPageProps) {
  // ✨ Await params terlebih dahulu
  const { slug } = await params;

  // Fetch data menggunakan slug yang sudah di-await
  const categoryDetail = await getPublicEventCategoryBySlug(slug);

  if (!categoryDetail) {
    notFound();
  }

  const portfolios = categoryDetail.portfolios || [];

  return (
    <main className="w-full min-h-screen bg-white py-16 md:py-24">
      <div className="container">
        {/* === Header Detail Kategori === */}
        <div className="flex flex-col items-center mb-16 text-center">
          <h1 className="text-3xl md:text-5xl font-normal text-gray-900 mb-4">
            {categoryDetail.title}
          </h1>
          <p className="text-gray-500 italic">
            Total {portfolios.length} portfolios inside this occasion
          </p>
        </div>

        {/* === Grid Children / Portfolios === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolios.map((item) => (
            <div key={item.id} className="group block cursor-pointer">
              <div className="relative w-full aspect-square bg-stone-100 mb-4 overflow-hidden rounded-md">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#C4A48E] transition-colors">
                {item.title}
              </h3>

              <p className="text-sm text-gray-500">for {item.clientName}</p>

              {item.orderQuantity > 0 && (
                <p className="text-xs text-[#C4A48E] mt-1 font-medium">
                  Order: {item.orderQuantity} pcs
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
