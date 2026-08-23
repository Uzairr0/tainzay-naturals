import Link from 'next/link';
import ReviewCard from '@/components/reviews/ReviewCard';
import type { Review } from '@/types';

interface ReviewsFeedProps {
  reviews: Review[];
  title?: string;
  emptyMessage?: string;
  showProduct?: boolean;
}

export default function ReviewsFeed({
  reviews,
  title = 'Customer Reviews',
  emptyMessage = 'No reviews yet. Be the first to share your experience.',
  showProduct = true,
}: ReviewsFeedProps) {
  return (
    <section className="reviews-feed" aria-labelledby="reviews-feed-title">
      <header className="reviews-feed-head">
        <div className="section-heading">
          <h2 id="reviews-feed-title" className="section-heading-text">
            {title}
          </h2>
        </div>
        {reviews.length > 0 && (
          <p className="reviews-feed-count">
            Showing {reviews.length} review{reviews.length === 1 ? '' : 's'}
          </p>
        )}
      </header>

      {reviews.length === 0 ? (
        <div className="reviews-empty">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <ul className="reviews-grid">
          {reviews.map((review) => (
            <li key={review._id}>
              <ReviewCard review={review} showProduct={showProduct} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

interface ProductReviewsSectionProps {
  productSlug: string;
  productName: string;
  reviews: Review[];
  totalReviews: number;
}

export function ProductReviewsSection({
  productSlug,
  productName,
  reviews,
  totalReviews,
}: ProductReviewsSectionProps) {
  const writeReviewHref = `/reviews?product=${encodeURIComponent(productSlug)}#review-form`;

  return (
    <section className="pdp-reviews" aria-labelledby="pdp-reviews-title">
      <div className="pdp-reviews-head">
        <h2 id="pdp-reviews-title" className="pdp-reviews-title">
          Customer Reviews
        </h2>
        <Link href={writeReviewHref} className="pdp-reviews-write-link">
          Write a review
        </Link>
      </div>

      {reviews.length === 0 ? (
        <div className="pdp-reviews-empty">
          <p>No reviews for {productName} yet.</p>
          <Link href={writeReviewHref} className="btn-primary-dark pdp-reviews-empty-btn">
            Be the first to review
          </Link>
        </div>
      ) : (
        <>
          <ul className="pdp-reviews-list">
            {reviews.map((review) => (
              <li key={review._id}>
                <ReviewCard review={review} showProduct={false} />
              </li>
            ))}
          </ul>

          {totalReviews > reviews.length && (
            <Link href={`/reviews?product=${encodeURIComponent(productSlug)}`} className="pdp-reviews-all-link">
              View all {totalReviews} reviews
            </Link>
          )}
        </>
      )}
    </section>
  );
}
