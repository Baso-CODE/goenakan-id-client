import Image from "next/image";
import Link from "next/link";
import { getPublicCategories } from "../api/products/categoryProduct.api";

export default async function ProductCategory() {
  const categories = await getPublicCategories();

  if (categories.length === 0) return null;

  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* Judul Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl text-gray-900 uppercase tracking-wide">
            Product Category
          </h2>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products/category/${category.slug}`}
              className="group relative block w-full aspect-square overflow-hidden rounded-sm">
              {/* Wrapper Div untuk Animasi Zoom */}
              <div className="relative w-full h-full bg-stone-300 flex items-center justify-center transition-all duration-500 ease-out transform group-hover:scale-110 cursor-pointer">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  // Background placeholder jika tidak ada foto (Gaya awal Anda)
                  <div className="absolute inset-0 bg-stone-400" />
                )}

                {/* Overlay Hitam Transparan agar teks terbaca */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors z-10" />

                {/* Teks Kategori */}
                <span className="relative text-white text-xl md:text-2xl font-bold uppercase tracking-widest z-20 drop-shadow-lg px-4 text-center">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
