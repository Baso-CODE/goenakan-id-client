import { ContactForm } from "@/app/components/contact/contactForm";
import { LocationMap } from "@/app/components/contact/locationMap";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("contactTitle"),
    description: t("contactDescription"),
    openGraph: {
      title: t("contactTitle"),
      description: t("contactDescription"),
      type: "website",
    },
  };
}

export default async function ContactPage() {
  return (
    <>
      <ContactForm />
      <LocationMap height="500px" />
    </>
  );
}
