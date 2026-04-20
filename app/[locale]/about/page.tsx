import { AboutUsTimeline } from "../../components/about/aboutusTimeline";
import { BelovedClients } from "../../components/about/belovedClients";
import { CoreValues } from "../../components/about/coreValues";
import { ShortStorySection } from "../../components/about/shortStorySection";

export default function AboutPage() {
  return (
    <>
      <AboutUsTimeline />
      <ShortStorySection />
      <CoreValues />
      <BelovedClients
        clients={[
          { id: "1", name: "Brand A", logo: "/clients/brand-a.png" },
          { id: "2", name: "Brand B", logo: "/clients/brand-b.png" },
        ]}
        speed={35}
        storiesHref="/portfolio"
      />
    </>
  );
}
