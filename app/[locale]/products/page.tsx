import { BannerProduct } from "@/app/components/products/bannerProduct";
import { CustomCTA } from "@/app/components/products/customCTA";
import FilterProduct from "@/app/components/products/filterProduct";

export default function ProductsPage() {
  const mySlides = [
    {
      id: "1",
      color: "bg-stone-500",
      title: "New Collection",
      subtitle: "Explore our latest products",
      href: "/products",
    },
    {
      id: "2",
      color: "bg-stone-300",
      title: "Best Sellers",
      subtitle: "Shop what everyone loves",
      href: "/products",
    },
    {
      id: "3",
      color: "bg-stone-200",
      title: "Special Offer",
      subtitle: "Min. order 100 pcs",
      href: "/products",
    },
    {
      id: "4",
      color: "bg-stone-400",
      title: "Custom Order",
      subtitle: "Personalize your product",
      href: "/products",
    },
  ];

  return (
    <>
      <BannerProduct slides={mySlides} interval={4000} />
      <FilterProduct />
      <CustomCTA
        title="Can’t Find the Product You’re Looking For?"
        description="No worries. Create it yourself with our custom mockup generator. From ideas to visuals, we’ll help bring it to life."
        buttonText="Start Customizing"
        href="/products/customize"
      />
    </>
  );
}
