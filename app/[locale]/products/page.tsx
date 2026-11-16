import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { BannerProduct } from "@/app/components/products/bannerProduct";
import { CustomCTA } from "@/app/components/products/customCTA";
import FilterProduct from "@/app/components/products/filterProduct";

type Props = {
  params: Promise<{ locale: string }>;
};

// 2. Fungsi untuk menghasilkan metadata secara dinamis

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const lang = locale === "en" ? "en" : "id";
  const siteUrl = "https://goenakan.id";

  const t = await getTranslations({
    locale: lang,
    namespace: "Metadata",
  });

  const title = t("productsTitle");
  const description = t("productsDescription");

  const canonical = `${siteUrl}/${lang}/products`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        id: `${siteUrl}/id/products`,
        en: `${siteUrl}/en/products`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Goenakan Indonesia",
      type: "website",
      locale: lang === "en" ? "en_US" : "id_ID",
    },
  };
}

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
