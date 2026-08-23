import ProductCarousel from '@/components/home/ProductCarousel';
import type { Product } from '@/types';

interface ProductRecommendationSectionProps {
  title: string;
  titleId: string;
  products: Product[];
  ariaLabel: string;
  variant?: 'white' | 'gray';
}

/**
 * PDP recommendation rails (You May Also Like, Recently Viewed, Popular).
 * ProductCard decides discount display per product via isOfferProduct().
 */
export default function ProductRecommendationSection({
  title,
  titleId,
  products,
  ariaLabel,
  variant = 'gray',
}: ProductRecommendationSectionProps) {
  if (products.length === 0) return null;

  return (
    <section
      className={`pdp-recommendation section-padding ${variant === 'gray' ? 'bg-surface-gray' : 'bg-surface-white'}`}
      aria-labelledby={titleId}
    >
      <div className="container-wide">
        <div className="section-heading">
          <h2 id={titleId} className="section-heading-text">
            {title}
          </h2>
        </div>

        <ProductCarousel products={products} ariaLabel={ariaLabel} />
      </div>
    </section>
  );
}
