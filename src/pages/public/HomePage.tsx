import HeroSection from '../../components/HeroSection';
import CategoriesSection from '../../components/CategoriesSection';
import FeaturedProducts from '../../components/FeaturedProducts';
import EditorialBanner from '../../components/EditorialBanner';
import FeaturedCarousel from '../../components/FeaturedCarousel';

export default function HomePage() {
  return (
    <>
      <HeroSection />
        <FeaturedCarousel />
      <CategoriesSection />
      <FeaturedProducts />
      <EditorialBanner />

    </>
  );
}