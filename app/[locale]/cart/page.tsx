import CartPage from "@/app/components/cart/cartPage";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("cartTitle"),
    description: t("cartDescription"),
    openGraph: {
      title: t("cartTitle"),
      description: t("cartDescription"),
      type: "website",
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function Page({ params }: Props) {
  return <CartPage />;
}
