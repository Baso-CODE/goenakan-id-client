import { TooltipProvider } from "@/components/ui/tooltip";
import { routing } from "@/i18n/routing";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Gilda_Display } from "next/font/google";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";

import { getPublicAppSettings } from "../api/app-setting/getAppSettings.api";
import Footer from "../components/navigation/Footer";
import Navbar from "../components/navigation/Navbar";
import TrackingScripts from "../components/tracking/trackingScripts";
import "../globals.css";

const gilda = Gilda_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gilda",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicAppSettings();

  return {
    title: "Goenakan Indonesia",
    description: "Platform Goenakan Indonesia",

    verification: settings.googleSiteVerification
      ? {
          google: settings.googleSiteVerification,
        }
      : undefined,
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const [messages, settings] = await Promise.all([
    getMessages(),
    getPublicAppSettings(),
  ]);

  return (
    <html lang={locale}>
      <body
        className={`${gilda.variable} ${gilda.className} antialiased scroll-smooth`}>
        <NextAuthProvider>
          <NextIntlClientProvider messages={messages}>
            <Navbar />

            <TooltipProvider>{children}</TooltipProvider>

            <Toaster position="top-center" richColors />

            <Footer />
          </NextIntlClientProvider>
        </NextAuthProvider>

        <TrackingScripts settings={settings} />
      </body>
    </html>
  );
}
