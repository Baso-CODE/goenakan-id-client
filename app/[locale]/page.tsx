import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Faq from "../components/Faq";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";

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

  const t = await getTranslations({
    locale,
    namespace: "Metadata",
  });

  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
    openGraph: {
      title: t("homeTitle"),
      description: t("homeDescription"),
      type: "website",
    },
  };
}

export default function Home() {
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
      <LazyArticles />
      <Faq />
    </>
  );
}
