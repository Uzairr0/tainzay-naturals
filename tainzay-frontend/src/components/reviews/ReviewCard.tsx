import Link from 'next/link';
import StarRating from '@/components/shared/StarRating';
import { formatReviewDate } from '@/lib/reviews';
import type { Review } from '@/types';

interface ReviewCardProps {
  review: Review;
  showProduct?: boolean;
}

export default function ReviewCard({ review, showProduct = true }: ReviewCardProps) {
  return (
    <article className="review-card">
      <div className="review-card-head">
        <StarRating rating={review.rating} size="md" />
        <time className="review-card-date" dateTime={review.createdAt}>
          {formatReviewDate(review.createdAt)}
        </time>
      </div>

      <p className="review-card-comment">{review.comment}</p>

      <footer className="review-card-footer">
        <span className="review-card-author">{review.authorName}</span>
        {showProduct && (
          <>
            <span className="review-card-separator" aria-hidden="true">
              ·
            </span>
            <Link href={`/products/${review.productSlug}`} className="review-card-product">
              {review.productName}
            </Link>
          </>
        )}
      </footer>
    </article>
  );
}
