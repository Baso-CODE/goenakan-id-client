import { Link } from "@/i18n/routing";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

import { getPublicCategories } from "../api/products/categoryProduct.api";

export default async function ProductCategory() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("ProductCategory"),
  ]);

  const categories = await getPublicCategories(locale);

  if (!categories?.length) {
    return null;
  }

  return (
    <section className="w-full py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl text-gray-900 uppercase tracking-wide">
            {t("title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group relative block w-full aspect-square overflow-hidden rounded-sm">
              <div className="relative w-full h-full bg-stone-300 flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-110 cursor-pointer">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-opacity duration-300 group-hover:opacity-90"
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
