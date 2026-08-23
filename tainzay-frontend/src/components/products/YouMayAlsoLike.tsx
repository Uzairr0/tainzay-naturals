import ProductRecommendationSection from '@/components/products/ProductRecommendationSection';
import type { Product } from '@/types';

interface YouMayAlsoLikeProps {
  products: Product[];
}

export default function YouMayAlsoLike({ products }: YouMayAlsoLikeProps) {
  return (
    <ProductRecommendationSection
      title="You May Also Like"
      titleId="pdp-related-title"
      products={products}
      ariaLabel="You may also like products"
      variant="white"
    />
  );
}
