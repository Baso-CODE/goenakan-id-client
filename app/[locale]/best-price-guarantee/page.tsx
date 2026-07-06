import { getBestPriceGuarantees } from "@/app/api/bestPriceGuarantee/getBestPriceGuaranteePage.api";
import { BestPricePage } from "@/app/components/bestPriceGuarantee/bestPriceGuaranteePage";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("bestPriceTitle"),
    description: t("bestPriceDescription"),
    openGraph: {
      title: t("bestPriceTitle"),
      description: t("bestPriceDescription"),
      type: "website",
    },
  };
}

export default async function BestPriceRoutePage({ params }: Props) {
  const { locale } = await params;
  const items = await getBestPriceGuarantees();

  const pageTitle =
    locale === "id" ? "Garansi Harga Terbaik" : "Best Price Guarantee";

  return (
    <>
      <BestPricePage title={pageTitle} items={items} />
    </>
  );
}
