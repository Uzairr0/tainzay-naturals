'use client';

import { useEffect, useState } from 'react';
import ProductRecommendationSection from '@/components/products/ProductRecommendationSection';
import { addRecentlyViewed, getRecentlyViewed } from '@/lib/recently-viewed';
import type { Product } from '@/types';

interface RecentlyViewedOrPopularProps {
  product: Product;
  popularProducts: Product[];
}

export default function RecentlyViewedOrPopular({
  product,
  popularProducts,
}: RecentlyViewedOrPopularProps) {
  const [section, setSection] = useState<{
    title: string;
    products: Product[];
  } | null>(null);

  useEffect(() => {
    addRecentlyViewed(product);

    const recent = getRecentlyViewed(product.slug);
    if (recent.length > 0) {
      setSection({
        title: 'Recently Viewed Products',
        products: recent,
      });
      return;
    }

    const popular = popularProducts.filter((item) => item.slug !== product.slug);
    if (popular.length > 0) {
      setSection({
        title: 'Popular Products',
        products: popular,
      });
    }
  }, [product, popularProducts]);

  if (!section) return null;

  const titleId =
    section.title === 'Recently Viewed Products'
      ? 'pdp-recently-viewed-title'
      : 'pdp-popular-title';

  return (
    <ProductRecommendationSection
      title={section.title}
      titleId={titleId}
      products={section.products}
      ariaLabel={section.title}
      variant="gray"
    />
  );
}
