import HeroSection from "../../components/HeroSection";
import CategoriesSection from "../../components/CategoriesSection";
import EditorialBanner from "../../components/EditorialBanner";
import FeaturedCarousel from "../../components/FeaturedCarousel";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCarousel />
      <EditorialBanner />
      <CategoriesSection />
      <div className="border-t border-border py-16 flex items-center justify-center px-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          URBAN CRAFT · SS 2026 · Minimalist Streetwear
        </span>
      </div>
    </>
  );
}
