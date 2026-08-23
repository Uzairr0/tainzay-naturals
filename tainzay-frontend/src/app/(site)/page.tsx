import HeroSlider from '@/components/home/HeroSlider';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import ConcernSection from '@/components/home/ConcernSection';
import OffersCarousel from '@/components/home/OffersCarousel';
import HomeStructuredData from '@/components/seo/HomeStructuredData';
import { fetchCatalogSegments } from '@/lib/catalog-segments';
import { fetchProductFacets } from '@/lib/catalogue';
import { filterHomeCategoriesWithProducts } from '@/lib/categories';
import { EMPTY_FILTERS } from '@/lib/product-filters';
import { HOME_METADATA } from '@/lib/site-seo';

export const metadata = HOME_METADATA;

/**
 * Home page section order (matches Herbiotics reference):
 * Layout shell: AnnouncementBar → Header (+ CategoryNav) → …
 * 1. Hero carousel
 * 2. Category grid
 * 3. Featured products (tabs + carousel)
 * 4. Concern / health goals
 * 5. Latest offers carousel
 * 6. Bottom CTA
 * Layout shell: Footer → WhatsApp FAB
 */
export default async function Home() {
  const [{ offers, bestSelling, newArrivals }, facetsResult] = await Promise.all([
    fetchCatalogSegments(),
    fetchProductFacets(EMPTY_FILTERS),
  ]);

  const homeCategories = filterHomeCategoriesWithProducts(facetsResult.data.categories);

  return (
    <div className="home-page flex flex-col">
      <HomeStructuredData />
      <HeroSlider />
      <CategoryGrid categories={homeCategories} />
      <FeaturedProducts
        featuredProducts={bestSelling}
        newArrivals={newArrivals}
      />
      <ConcernSection />
      <OffersCarousel offers={offers} />
      {/* <HomeCtaSection /> */}
      {/* <BlogSection /> */}
    </div>
  );
}
