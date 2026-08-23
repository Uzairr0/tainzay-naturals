'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import StarRatingInput from '@/components/reviews/StarRatingInput';
import { reviewsApi } from '@/lib/api';
import type { Product, ReviewFormData } from '@/types';

interface ReviewFormProps {
  products: Product[];
  initialProductSlug?: string;
}

const EMPTY_FORM: ReviewFormData = {
  productSlug: '',
  authorName: '',
  email: '',
  rating: 0,
  comment: '',
};

export default function ReviewForm({ products, initialProductSlug }: ReviewFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ReviewFormData>({
    ...EMPTY_FORM,
    productSlug: initialProductSlug ?? '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    if (!formData.productSlug) {
      setSubmitError('Please select a product.');
      return;
    }

    if (formData.rating < 1) {
      setSubmitError('Please select a star rating.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await reviewsApi.create(formData);
      setSubmitSuccess(response.data.message);
      setFormData({
        ...EMPTY_FORM,
        productSlug: initialProductSlug ?? '',
      });
      router.refresh();
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to submit review. Please try again.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="review-form-section" id="review-form" aria-labelledby="review-form-title">
      <div className="review-form-card">
        <header className="review-form-header">
          <h2 id="review-form-title" className="review-form-title">
            Share Your Experience
          </h2>
          <p className="review-form-lead">
            Tell us how Tainzy Naturals worked for you. Reviews are checked before they appear on
            the site.
          </p>
        </header>

        <form className="review-form" onSubmit={handleSubmit} noValidate>
          <div className="review-form-grid">
            <label className="review-form-field review-form-field-full" htmlFor="review-product">
              <span className="review-form-label">Product</span>
              <select
                id="review-product"
                className="review-form-select"
                value={formData.productSlug}
                disabled={isSubmitting}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, productSlug: event.target.value }))
                }
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.slug} value={product.slug}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="review-form-field" htmlFor="review-name">
              <span className="review-form-label">Your name</span>
              <input
                id="review-name"
                type="text"
                className="review-form-input"
                value={formData.authorName}
                disabled={isSubmitting}
                maxLength={80}
                required
                onChange={(event) =>
                  setFormData((current) => ({ ...current, authorName: event.target.value }))
                }
              />
            </label>

            <label className="review-form-field" htmlFor="review-email">
              <span className="review-form-label">
                Email <span className="review-form-optional">(optional, not shown publicly)</span>
              </span>
              <input
                id="review-email"
                type="email"
                className="review-form-input"
                value={formData.email}
                disabled={isSubmitting}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, email: event.target.value }))
                }
              />
            </label>

            <div className="review-form-field review-form-field-full">
              <StarRatingInput
                value={formData.rating}
                disabled={isSubmitting}
                onChange={(rating) => setFormData((current) => ({ ...current, rating }))}
              />
            </div>

            <label className="review-form-field review-form-field-full" htmlFor="review-comment">
              <span className="review-form-label">Your review</span>
              <textarea
                id="review-comment"
                className="review-form-textarea"
                rows={5}
                value={formData.comment}
                disabled={isSubmitting}
                minLength={10}
                maxLength={2000}
                required
                placeholder="What did you like? How did the product help you?"
                onChange={(event) =>
                  setFormData((current) => ({ ...current, comment: event.target.value }))
                }
              />
            </label>
          </div>

          {submitError && (
            <p className="review-form-message review-form-message-error" role="alert">
              {submitError}
            </p>
          )}

          {submitSuccess && (
            <p className="review-form-message review-form-message-success" role="status">
              {submitSuccess}
            </p>
          )}

          <button type="submit" className="btn-primary-dark review-form-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting…' : 'Submit Review'}
          </button>
        </form>
      </div>
    </section>
  );
}
