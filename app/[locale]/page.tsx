import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Articles from "../components/Articles";
import BestSeller from "../components/BestSeller";
import Faq from "../components/Faq";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Newsletter from "../components/Newsletter";
import { PlanningLargerOrder } from "../components/PlaningLargeOrder";
import Portfolio from "../components/Portfolio";
import PortfolioEventsAndClients from "../components/PortfolioEventsAndClients";
import ProductCategory from "../components/ProductCategory";
import ServiceFeatures from "../components/ServiceFeatures";
import Testimonials from "../components/Testimonials";
import WhoWeAre from "../components/WhoWeAre";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "Metadata" });

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

export default async function Home() {
  return (
    <>
      <Hero />
      <WhoWeAre />
      <ProductCategory />
      <Portfolio />
      <PortfolioEventsAndClients />
      <ServiceFeatures />
      <HowItWorks />
      <Newsletter />
      <BestSeller />
      <Testimonials />
      <PlanningLargerOrder />
      <Articles />
      <Faq />
    </>
  );
}
