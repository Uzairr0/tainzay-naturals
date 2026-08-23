import type { Metadata } from 'next';
import { Suspense } from 'react';
import ConcernFinderExperience from '@/components/concern-finder/ConcernFinderExperience';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { fetchProductList } from '@/lib/catalogue';
import { SITE } from '@/lib/site-config';
import type { Product } from '@/types';

import { CONCERN_METADATA } from '@/lib/site-seo';

export const metadata: Metadata = CONCERN_METADATA;

function buildProductsBySlug(products: Product[]): Record<string, Product> {
  return Object.fromEntries(products.map((product) => [product.slug, product]));
}

export default async function KnowYourConcernPage() {
  const { data } = await fetchProductList({ sort: 'name-asc', page: 1 }, 100);
  const productsBySlug = buildProductsBySlug(data.products);

  return (
    <div className="concern-finder-page">
      <div className="container-wide">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Know Your Concern' },
          ]}
        />
      </div>

      <Suspense fallback={<div className="concern-finder-loading">Loading…</div>}>
        <ConcernFinderExperience productsBySlug={productsBySlug} />
      </Suspense>

      <div className="container-wide concern-finder-footer-note">
        <p>
          Recommendations are based on your selected concern and general wellness needs. For
          personalized medical advice, consult a healthcare professional. All {SITE.name} products
          are available for wholesale order.
        </p>
      </div>
    </div>
  );
}
