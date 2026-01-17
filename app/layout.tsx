import type { Metadata } from "next";
import { Gilda_Display } from "next/font/google";
import Footer from "./components/navigation/Footer";
import Navbar from "./components/navigation/Navbar";
import "./globals.css";

// Menginisialisasi font Gilda Display
const gilda = Gilda_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gilda",
});

export const metadata: Metadata = {
  title: "Goenakan Indonesia", // Saya sesuaikan judulnya dengan project kamu
  description: "Platform Goenakan Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${gilda.variable} ${gilda.className} antialiased scroll-smooth`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
