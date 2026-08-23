'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Check, ExternalLink, X } from 'lucide-react';
import clsx from 'clsx';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import StarRating from '@/components/shared/StarRating';
import { reviewsApi } from '@/lib/api';
import { formatReviewDate } from '@/lib/reviews';
import type { AdminReviewStatus } from '@/lib/admin-reviews';
import type { Review } from '@/types';

const TABS: { id: AdminReviewStatus; label: string }[] = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
];

interface AdminReviewsManagerProps {
  initialReviews: Review[];
  initialStatus: AdminReviewStatus;
  error?: string | null;
}

export default function AdminReviewsManager({
  initialReviews,
  initialStatus,
  error,
}: AdminReviewsManagerProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');
  const [rejectTarget, setRejectTarget] = useState<Review | null>(null);

  async function updateStatus(reviewId: string, status: AdminReviewStatus): Promise<boolean> {
    setBusyId(reviewId);
    setActionError('');

    try {
      await reviewsApi.updateStatus(reviewId, status);
      setReviews((current) => current.filter((review) => review._id !== reviewId));
      router.refresh();
      return true;
    } catch (updateError: unknown) {
      const message =
        (updateError as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to update review status.';
      setActionError(message);
      return false;
    } finally {
      setBusyId(null);
    }
  }

  function handleApprove(review: Review) {
    void updateStatus(review._id, 'approved');
  }

  function handleReject(review: Review) {
    setRejectTarget(review);
  }

  async function confirmReject() {
    if (!rejectTarget) return;
    const success = await updateStatus(rejectTarget._id, 'rejected');
    if (success) setRejectTarget(null);
  }

  return (
    <div className="admin-reviews">
      <AdminConfirmDialog
        open={rejectTarget !== null}
        title="Reject this review?"
        message={
          rejectTarget
            ? `${rejectTarget.authorName}'s review will be hidden from the website.`
            : ''
        }
        confirmLabel="Reject review"
        onConfirm={confirmReject}
        onCancel={() => setRejectTarget(null)}
      />
      <div className="admin-reviews-toolbar">
        <div className="admin-reviews-tabs" role="tablist" aria-label="Review status">
          {TABS.map((tab) => {
            const isActive = initialStatus === tab.id;
            return (
              <Link
                key={tab.id}
                href={`/admin/reviews?status=${tab.id}`}
                role="tab"
                aria-selected={isActive}
                className={clsx('admin-reviews-tab', isActive && 'is-active')}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <p className="admin-reviews-summary">
          {reviews.length} {initialStatus} review{reviews.length === 1 ? '' : 's'}
        </p>
      </div>

      {(error || actionError) && (
        <div className="admin-alert admin-alert-error" role="alert">
          {actionError || error}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="admin-empty-state">
          <p>No {initialStatus} reviews right now.</p>
          {initialStatus === 'pending' && (
            <p className="admin-empty-state-hint">
              New submissions from the website will appear here for approval.
            </p>
          )}
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table admin-reviews-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Rating</th>
                <th>Customer</th>
                <th>Review</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => {
                const isBusy = busyId === review._id;

                return (
                  <tr key={review._id}>
                    <td data-label="Product">
                      <div className="admin-review-product">
                        <Link
                          href={`/products/${review.productSlug}`}
                          className="admin-review-product-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {review.productName}
                          <ExternalLink size={14} aria-hidden="true" />
                        </Link>
                      </div>
                    </td>
                    <td data-label="Rating">
                      <StarRating rating={review.rating} size="sm" />
                    </td>
                    <td data-label="Customer">
                      <span className="admin-review-author">{review.authorName}</span>
                    </td>
                    <td data-label="Review">
                      <p className="admin-review-comment">{review.comment}</p>
                    </td>
                    <td data-label="Date">
                      <time dateTime={review.createdAt}>{formatReviewDate(review.createdAt)}</time>
                    </td>
                    <td data-label="Actions">
                      <div className="admin-review-actions">
                        {initialStatus !== 'approved' && (
                          <button
                            type="button"
                            className="admin-action-btn admin-action-btn-approve"
                            disabled={isBusy}
                            onClick={() => handleApprove(review)}
                          >
                            <Check size={16} aria-hidden="true" />
                            Approve
                          </button>
                        )}
                        {initialStatus !== 'rejected' && (
                          <button
                            type="button"
                            className="admin-action-btn admin-action-btn-reject"
                            disabled={isBusy}
                            onClick={() => handleReject(review)}
                          >
                            <X size={16} aria-hidden="true" />
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
