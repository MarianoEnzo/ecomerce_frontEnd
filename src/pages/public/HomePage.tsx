import HeroSection from "../../components/HeroSection";
import CategoriesSection from "../../components/CategoriesSection";
import FeaturedProducts from "../../components/FeaturedProducts";
import EditorialBanner from "../../components/EditorialBanner";
import FeaturedCarousel from "../../components/FeaturedCarousel";
import SourceBanner from "../../components/sourceBanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCarousel />
      <EditorialBanner />
      <CategoriesSection />
      <FeaturedProducts />

      <SourceBanner />
    </>
  );
}
