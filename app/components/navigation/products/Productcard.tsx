"use client";

import Image from "next/image";

import { Product } from "@/app/types/product.type";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface ProductCardProps {
  product: Product;
}

function formatCurrency(amount: number, currencyCode: string = "IDR"): string {
  let locale = "id-ID";
  if (currencyCode === "USD") locale = "en-US";
  else if (currencyCode === "EUR") locale = "de-DE";
  else if (currencyCode === "JPY") locale = "ja-JP";
  else if (currencyCode === "MYR") locale = "ms-MY";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: currencyCode === "IDR" ? 0 : 2,
    maximumFractionDigits: currencyCode === "IDR" ? 0 : 2,
  }).format(amount);
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("Product-Card");
  const currency = product.currencyCode || "IDR";

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative flex flex-col bg-white border border-stone-100 rounded-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative aspect-4/5 bg-stone-50 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1.5 p-4 pt-3 pb-4">
          <h3 className="font-semibold text-stone-800 text-[15px] leading-snug tracking-tight">
            {product.name}
          </h3>
          <div className="flex flex-col gap-0.5">
            <p className="text-stone-400 text-xs line-through">
              {formatCurrency(product.regularPrice, currency)}/pcs
            </p>
            <p className="text-stone-800 text-sm font-medium">
              {formatCurrency(product.bulkPrice, currency)}/pcs{" "}
              <span className="text-stone-400 font-normal">
                min. {product.minOrder} pcs
              </span>
            </p>
          </div>
          <div className="pt-1 mt-auto">
            <Badge
              variant="secondary"
              className="text-xs text-stone-400 bg-stone-50 border-0 px-0 font-normal">
              {product.sold.toLocaleString("id-ID")} {t("sold")}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
