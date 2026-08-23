import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewsFeed from '@/components/reviews/ReviewsFeed';
import { fetchProductList } from '@/lib/catalogue';
import { fetchApprovedReviews } from '@/lib/reviews';

import { REVIEWS_METADATA } from '@/lib/site-seo';

export const metadata: Metadata = REVIEWS_METADATA;

interface ReviewsPageProps {
  searchParams: Promise<{ product?: string }>;
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const { product: productSlug } = await searchParams;

  const [{ data: reviews, error }, { data: productList }] = await Promise.all([
    fetchApprovedReviews({ page: 1, limit: 50, product: productSlug }),
    fetchProductList({ sort: 'name-asc', page: 1 }, 100),
  ]);

  const selectedProduct = productSlug
    ? productList.products.find((product) => product.slug === productSlug)
    : undefined;

  const feedTitle = selectedProduct
    ? `Reviews for ${selectedProduct.name}`
    : 'All Customer Reviews';

  return (
    <div className="reviews-page">
      <div className="container-wide">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Reviews' },
          ]}
        />
      </div>

      <section className="reviews-hero section-padding">
        <div className="container-wide reviews-hero-inner">
          <p className="reviews-eyebrow">Real experiences</p>
          <h1 className="reviews-title">Customer Reviews</h1>
          <p className="reviews-lead">
            See what customers say about Tainzay Naturals products, or share your own story to help
            others choose with confidence.
          </p>
        </div>
      </section>

      <div className="container-wide reviews-layout">
        <ReviewForm
          products={productList.products}
          initialProductSlug={productSlug}
        />

        {error ? (
          <div className="collection-notice" role="alert">
            <p>We couldn&apos;t load reviews right now. Please try again shortly.</p>
          </div>
        ) : (
          <ReviewsFeed
            reviews={reviews.reviews}
            title={feedTitle}
            showProduct={!productSlug}
          />
        )}
      </div>
    </div>
  );
}
