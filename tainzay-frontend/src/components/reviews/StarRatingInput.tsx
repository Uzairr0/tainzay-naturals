'use client';

import { Star } from 'lucide-react';

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  id?: string;
}

export default function StarRatingInput({
  value,
  onChange,
  disabled = false,
  id = 'review-rating',
}: StarRatingInputProps) {
  return (
    <div className="review-rating-input" role="radiogroup" aria-labelledby={`${id}-label`}>
      <span id={`${id}-label`} className="review-form-label">
        Your rating
      </span>
      <div className="review-rating-input-stars">
        {Array.from({ length: 5 }).map((_, index) => {
          const starValue = index + 1;
          const filled = starValue <= value;

          return (
            <button
              key={starValue}
              type="button"
              role="radio"
              aria-checked={value === starValue}
              aria-label={`${starValue} star${starValue === 1 ? '' : 's'}`}
              className={`review-rating-input-star${filled ? ' is-filled' : ''}`}
              disabled={disabled}
              onClick={() => onChange(starValue)}
            >
              <Star size={22} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
