'use client';

import { useMemo, useState } from 'react';
import ProductCarousel from '@/components/home/ProductCarousel';
import type { Product } from '@/types';

type FeaturedTab = 'best-selling' | 'new-arrivals';

interface FeaturedProductsProps {
  featuredProducts?: Product[];
  newArrivals?: Product[];
}

export default function FeaturedProducts({
  featuredProducts = [],
  newArrivals = [],
}: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState<FeaturedTab>('best-selling');

  const products = useMemo(
    () => (activeTab === 'best-selling' ? featuredProducts : newArrivals),
    [activeTab, featuredProducts, newArrivals],
  );

  return (
    <section className="section-padding bg-surface-white">
      <div className="container-site">
        <div className="section-heading">
          <h2 className="section-heading-text">Featured Products</h2>
        </div>

        <div className="flex justify-center mb-8 md:mb-10">
          <div className="tab-toggle" role="tablist" aria-label="Featured product filters">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'best-selling'}
              className={`tab-toggle-item ${activeTab === 'best-selling' ? 'active' : ''}`}
              onClick={() => setActiveTab('best-selling')}
            >
              Best Selling
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'new-arrivals'}
              className={`tab-toggle-item ${activeTab === 'new-arrivals' ? 'active' : ''}`}
              onClick={() => setActiveTab('new-arrivals')}
            >
              New Arrivals
            </button>
          </div>
        </div>

        <ProductCarousel
          key={activeTab}
          products={products}
          showDiscount={false}
          badgeLabel={activeTab === 'best-selling' ? 'Best Selling' : 'New Arrivals'}
          ariaLabel={
            activeTab === 'best-selling'
              ? 'Best selling products'
              : 'New arrival products'
          }
        />
      </div>
    </section>
  );
}
