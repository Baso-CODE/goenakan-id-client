import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Faq from "../components/Faq";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";

import { getActiveBanners } from "../api/articles/getActiveBanners.api";
import LazyArticles from "../components/lazy/lazyArticles";
import LazyBestSeller from "../components/lazy/lazyBestSeller";
import LazyPortfolio from "../components/lazy/lazyPortfolio";
import LazyPortfolioEventsAndClients from "../components/lazy/lazyPortfolioEventsAndClients";
import LazyProductCategory from "../components/lazy/lazyProductCategory";
import LazyServiceFeatures from "../components/lazy/lazyServiceFeatures";
import LazyWhoWeAre from "../components/lazy/lazyWhoWeAre";
import Newsletter from "../components/Newsletter";
import { PlanningLargerOrder } from "../components/PlaningLargeOrder";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const lang = locale === "en" ? "en" : "id";
  const siteUrl = "https://goenakan.id";

  const t = await getTranslations({
    locale: lang,
    namespace: "Metadata",
  });

  const title = t("homeTitle");
  const description = t("homeDescription");
  const canonical = `${siteUrl}/${lang}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        id: `${siteUrl}/id`,
        en: `${siteUrl}/en`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      siteName: "Goenakan Indonesia",
      locale: lang === "en" ? "en_US" : "id_ID",
    },
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;

  const lang = locale === "en" ? "en" : "id";
  const banners = await getActiveBanners(lang);

  return (
    <>
      <Hero />
      <LazyWhoWeAre />
      <LazyProductCategory />
      <LazyPortfolio />
      <LazyPortfolioEventsAndClients />
      <LazyServiceFeatures />
      <HowItWorks />
      <Newsletter />
      <LazyBestSeller />
      <PlanningLargerOrder />
      <LazyArticles banners={banners} />
      <Faq />
    </>
  );
}
