import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Gilda_Display } from "next/font/google";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import Footer from "../components/navigation/Footer";
import Navbar from "../components/navigation/Navbar";
import "../globals.css";

const gilda = Gilda_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gilda",
});

export const metadata: Metadata = {
  title: "Goenakan Indonesia",
  description: "Platform Goenakan Indonesia",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${gilda.variable} ${gilda.className} antialiased scroll-smooth`}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
          <Toaster />
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
