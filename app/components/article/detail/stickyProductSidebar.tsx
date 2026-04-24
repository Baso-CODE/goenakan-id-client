import { Link } from "@/i18n/routing";
import Image from "next/image";

interface SidebarProduct {
  id: string;
  name: string;
  image: string;
  href: string;
}

interface StickyProductSidebarProps {
  products?: SidebarProduct[];
  ctaHref?: string;
  ctaLabel?: string;
}

export function StickyProductSidebar({
  products = [],
  ctaHref = "/products",
  ctaLabel = "Konsultasi di WhatsApp",
}: StickyProductSidebarProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <aside className="sticky top-28 flex flex-col gap-3">
      <div className="border border-stone-200 rounded-sm bg-white p-3">
        {/* Title */}
        <p className="text-base font-semibold text-stone-700 mb-3 text-center">
          Our Best Souvenirs
        </p>

        {/* Product Grid 2 col */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={product.href}
              className="group flex flex-col gap-1">
              <div className="relative aspect-square w-full bg-stone-100 rounded-sm overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                  sizes="100px"
                />
              </div>
              <p className="text-xs text-stone-500 text-center leading-tight line-clamp-2 group-hover:text-stone-700 transition-colors">
                {product.name}
              </p>
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          href={ctaHref}
          className="block w-full text-center bg-[#3d342b] text-white text-[13px] py-2 rounded-sm hover:bg-[#2a2420] transition-colors">
          {ctaLabel}
        </Link>
      </div>
    </aside>
  );
}
