import LoginForm from "@/app/components/loginForm";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

// ✨ Generate Metadata Dinamis untuk halaman Login
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Baca json dari blok "Metadata"
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("loginTitle"),
    description: t("loginDescription"),
    openGraph: {
      title: t("loginTitle"),
      description: t("loginDescription"),
      type: "website",
    },
  };
}

export default async function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-16">
      <LoginForm />
    </div>
  );
}
