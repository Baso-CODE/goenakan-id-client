import RegisterPage from "@/app/components/register/registerPage";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("registerTitle"),
    description: t("registerDescription"),
    openGraph: {
      title: t("registerTitle"),
      description: t("registerDescription"),
      type: "website",
    },
  };
}

export default async function RegisterPages() {
  return (
    <>
      <RegisterPage />
    </>
  );
}
