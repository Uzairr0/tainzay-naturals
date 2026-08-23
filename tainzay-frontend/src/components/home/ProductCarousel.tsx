'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import ProductCard from '@/components/home/ProductCard';
import {
  chunkArray,
  useItemsPerPage,
  useSwipe,
} from '@/hooks/useCarousel';
import type { Product } from '@/types';

interface ProductCarouselProps {
  products: Product[];
  ariaLabel?: string;
  /** Pass false for Featured tabs that must always show list price */
  showDiscount?: boolean;
  badgeLabel?: string;
}

export default function ProductCarousel({
  products,
  ariaLabel = 'Product carousel',
  showDiscount,
  badgeLabel,
}: ProductCarouselProps) {
  const itemsPerPage = useItemsPerPage();
  const pages = useMemo(
    () => chunkArray(products, itemsPerPage),
    [products, itemsPerPage],
  );
  const [page, setPage] = useState(0);
  const total = pages.length;
  // Page count changes with the viewport, so clamp rather than reset
  const current = total > 0 ? Math.min(page, total - 1) : 0;

  const goTo = useCallback(
    (index: number) => {
      if (total <= 0) return;
      setPage((index + total) % total);
    },
    [total],
  );

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);
  const { onTouchStart, onTouchEnd } = useSwipe(goNext, goPrev);

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted" role="status">
        No products available at the moment.
      </div>
    );
  }

  return (
    <div
      className="product-carousel relative"
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out motion-safe"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {pages.map((page, pageIndex) => (
            <div
              key={pageIndex}
              className="w-full flex-shrink-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${pageIndex + 1} of ${total}`}
              aria-hidden={pageIndex !== current}
            >
              {page.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  showDiscount={showDiscount}
                  badgeLabel={badgeLabel}
                  priority={pageIndex === 0 && index < 2}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing page {current + 1} of {total}
      </p>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="product-carousel-arrow product-carousel-arrow-prev"
            aria-label="Previous products"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="product-carousel-arrow product-carousel-arrow-next"
            aria-label="Next products"
          >
            <ChevronRight size={24} />
          </button>

          <div className="product-carousel-dots" role="tablist" aria-label="Carousel pages">
            {pages.map((_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-label={`Go to page ${index + 1}`}
                aria-selected={index === current}
                onClick={() => goTo(index)}
                className={`product-carousel-dot ${index === current ? 'active' : ''}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
