import CheckoutPage from "@/app/components/checkout/checkoutPage";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

// ✨ 1. Definisikan tipe Props untuk menangkap parameter locale
type Props = {
  params: Promise<{ locale: string }>;
};

// ✨ 2. Generate Metadata untuk halaman Checkout
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Membaca json bagian "Metadata"
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("checkoutTitle"),
    description: t("checkoutDescription"),
    openGraph: {
      title: t("checkoutTitle"),
      description: t("checkoutDescription"),
      type: "website",
    },
    // Tambahan khusus untuk checkout: biasanya kita tidak ingin halaman checkout di-index oleh Google
    // agar data keranjang/sesi tidak terekam oleh bot pencari.
    robots: {
      index: false,
      follow: false,
    },
  };
}

// ✨ 3. Komponen utama
export default async function Page({ params }: Props) {
  return <CheckoutPage />;
}
