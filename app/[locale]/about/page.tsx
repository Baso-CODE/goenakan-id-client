"use client";
import { getBrandClients } from "@/app/api/client-logos/getBrandClient.api";
import { BrandClient } from "@/app/types/brandClient.type";
import { useEffect, useState } from "react";
import { AboutUsTimeline } from "../../components/about/aboutusTimeline";
import { BelovedClients } from "../../components/about/belovedClients";
import { CoreValues } from "../../components/about/coreValues";
import { ShortStorySection } from "../../components/about/shortStorySection";

export default function AboutPage() {
  const [clients, setClients] = useState<BrandClient[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBrandClients();
      const activeClients = data
        .filter((c) => c.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder);

      setClients(activeClients);
    };

    fetchData();
  }, []);
  return (
    <>
      <AboutUsTimeline />
      <ShortStorySection />
      <CoreValues />
      <BelovedClients clients={clients} speed={35} storiesHref="/portfolio" />
    </>
  );
}
