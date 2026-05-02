import { BannerProduct } from "@/app/components/navigation/products/bannerProduct";
import { CustomCTA } from "@/app/components/navigation/products/customCTA";
import FilterProduct from "@/app/components/navigation/products/filterProduct";

export default async function ProductsPage() {
  return (
    <>
      <BannerProduct />
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
