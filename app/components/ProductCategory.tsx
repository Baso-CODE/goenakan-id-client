import { Link } from "@/i18n/routing";
import Image from "next/image";

import { getPublicCategories } from "../api/products/categoryProduct.api";

import { getLocale, getTranslations } from "next-intl/server";

export default async function ProductCategory() {
  const locale = await getLocale();

  const t = await getTranslations("ProductCategory");

  const categories = await getPublicCategories(locale);

  if (categories.length === 0) return null;

  return (
    <section className="w-full py-20 bg-white">
      <div className="container ">
        {/* Judul Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl text-gray-900 uppercase tracking-wide">
            {t("title")}
          </h2>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products/category/${category.slug}`}
              className="group relative block w-full aspect-square overflow-hidden rounded-sm">
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
                  <div className="absolute inset-0 bg-stone-400" />
                )}

                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors z-10" />

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
