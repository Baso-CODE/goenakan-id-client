import Articles from "./components/Articles";
import BestSeller from "./components/BestSeller";
import Hero from "./components/Hero";
import Newsletter from "./components/Newsletter";
import Portfolio from "./components/Portfolio";
import PortfolioEventsAndClients from "./components/PortfolioEventsAndClients";
import ProductCategory from "./components/ProductCategory";
import Testimonials from "./components/Testimonials";
import WhoWeAre from "./components/WhoWeAre";

export default function Home() {
  return (
    <>
      <Hero />
      <WhoWeAre />
      <ProductCategory />
      <Portfolio />
      <PortfolioEventsAndClients />
      <Newsletter />
      <BestSeller />
      <Testimonials />
      <Articles />
    </>
  );
}
