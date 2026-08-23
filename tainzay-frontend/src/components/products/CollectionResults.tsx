'use client';

import { Suspense } from 'react';
import ProductCard from '@/components/home/ProductCard';
import CollectionEmpty from '@/components/products/CollectionEmpty';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';
import { useProductFilters } from '@/hooks/useProductFilters';
import {
  getListingDisplayForProduct,
  type CatalogSegments,
} from '@/lib/catalog-segments';
import { hasActiveFilters, type ProductFilters } from '@/lib/product-filters';
import type { Product } from '@/types';

const LISTING_SIZES = '(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 28vw';

interface CollectionResultsProps {
  products: Product[];
  filters: ProductFilters;
  segments: CatalogSegments;
}

function Results({ products, filters, segments }: CollectionResultsProps) {
  const { isPending } = useProductFilters();

  if (isPending) {
    return <ProductGridSkeleton />;
  }

  if (products.length === 0) {
    return <CollectionEmpty hasFilters={hasActiveFilters(filters)} />;
  }

  return (
    <div className="product-grid">
      {products.map((product, index) => {
        const display = getListingDisplayForProduct(
          product,
          segments,
          filters.collection,
        );

        return (
          <ProductCard
            key={product._id}
            product={product}
            sizes={LISTING_SIZES}
            priority={index < 4}
            showDiscount={display.badgeLabel ? false : undefined}
            badgeLabel={display.badgeLabel}
          />
        );
      })}
    </div>
  );
}

/** Swaps the grid for skeletons while a filter or sort navigation is in flight */
export default function CollectionResults(props: CollectionResultsProps) {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <Results {...props} />
    </Suspense>
  );
}
