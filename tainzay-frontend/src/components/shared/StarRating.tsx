import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  /** Slightly larger stars for the product detail page */
  size?: 'sm' | 'md';
  className?: string;
}

export default function StarRating({
  rating,
  reviewCount,
  size = 'sm',
  className = '',
}: StarRatingProps) {
  const clamped = Math.max(0, Math.min(5, rating));
  const fullStars = Math.floor(clamped);
  const hasHalf = clamped - fullStars >= 0.5;
  const starSize = size === 'md' ? 18 : 14;

  return (
    <div
      className={`star-rating ${size === 'md' ? 'star-rating-md' : ''} ${className}`.trim()}
      aria-label={`Rated ${clamped} out of 5`}
    >
      <div className="star-rating-stars" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => {
          const filled = index < fullStars || (index === fullStars && hasHalf);

          return (
            <Star
              key={index}
              size={starSize}
              className={filled ? 'text-star-yellow fill-star-yellow' : 'text-border-default'}
            />
          );
        })}
      </div>
      {typeof reviewCount === 'number' && (
        <span className="star-rating-count">{reviewCount} reviews</span>
      )}
    </div>
  );
}
