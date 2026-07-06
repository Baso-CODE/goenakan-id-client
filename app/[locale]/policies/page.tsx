import { getAllPolicies } from "@/app/api/policy/getPolicyPage.api";
import { PolicyPage } from "@/app/components/policy/policyPage";
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
    title: t("policyTitle"),
    description: t("policyDescription"),
    openGraph: {
      title: t("policyTitle"),
      description: t("policyDescription"),
      type: "website",
    },
  };
}

export default async function PolicyRoutePage() {
  const categories = await getAllPolicies();

  return (
    <>
      <PolicyPage categories={categories} />
    </>
  );
}
