import { getPublicHeroSlides } from "../api/hero/getHero.api";
import HeroCarousel from "./heroCarousel";

export default async function Hero() {
  const slides = await getPublicHeroSlides();

  return <HeroCarousel slides={slides} />;
}
