import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { BannerProduct } from "@/app/components/navigation/products/bannerProduct";
import { CustomCTA } from "@/app/components/navigation/products/customCTA";
import FilterProduct from "@/app/components/navigation/products/filterProduct";

type Props = {
  params: Promise<{ locale: string }>;
};

// ✨ 2. Fungsi untuk menghasilkan metadata secara dinamis
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Membaca json bagian "Metadata"
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("productsTitle"),
    description: t("productsDescription"),
    openGraph: {
      title: t("productsTitle"),
      description: t("productsDescription"),
      type: "website",
    },
  };
}

// ✨ 3. Jangan lupa tambahkan props di komponen utama (opsional tapi best practice)
export default async function ProductsPage({ params }: Props) {
  return (
    <>
      <BannerProduct />
      <FilterProduct />
      <CustomCTA
        title="Can’t Find the Product You’re Looking For?"
        description="No worries. Create it yourself with our custom mockup generator. From ideas to visuals, we’ll help bring it to life."
        buttonText="Start Customizing"
        href="/products/customize"
      />
    </>
  );
}
