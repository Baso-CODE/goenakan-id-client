import { getMainFaqs } from "@/app/api/faq/getFaqPage.api";
import { FaqPage } from "@/app/components/faq/faqPage";
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
    title: t("faqTitle"),
    description: t("faqDescription"),
    openGraph: {
      title: t("faqTitle"),
      description: t("faqDescription"),
      type: "website",
    },
  };
}

export default async function FaqRoutePage() {
  const faqs = await getMainFaqs();

  return (
    <>
      <FaqPage title="Frequently Asked Questions" faqs={faqs} />
    </>
  );
}
