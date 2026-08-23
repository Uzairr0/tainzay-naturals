'use client';

import ProductCarousel from '@/components/home/ProductCarousel';
import type { Product } from '@/types';

interface OffersCarouselProps {
  offers?: Product[];
}

export default function OffersCarousel({ offers = [] }: OffersCarouselProps) {
  // Nothing to advertise until products carry a discounted wholesale tier
  if (offers.length === 0) return null;

  return (
    <section className="section-padding bg-surface-gray">
      <div className="container-site">
        <div className="section-heading">
          <h2 className="section-heading-text">Latest Offers & Discounts</h2>
        </div>

        <ProductCarousel
          products={offers}
          ariaLabel="Latest offers and discounts"
        />
      </div>
    </section>
  );
}
