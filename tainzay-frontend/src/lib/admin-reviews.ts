import { reviewsApi } from '@/lib/api';
import type { Fetched } from '@/lib/catalogue';
import type { Review } from '@/types';

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

export type AdminReviewStatus = Review['status'];

export async function fetchAdminReviews(
  status?: AdminReviewStatus,
): Promise<Fetched<Review[]>> {
  try {
    const response = await reviewsApi.getAll(status ? { status } : undefined);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Failed to fetch admin reviews:', describeError(error));
    return { data: [], error: describeError(error) };
  }
}

export async function fetchPendingReviewCount(): Promise<number> {
  const { data } = await fetchAdminReviews('pending');
  return data.length;
}

export function parseAdminReviewStatus(value: string | undefined): AdminReviewStatus {
  if (value === 'approved' || value === 'rejected' || value === 'pending') {
    return value;
  }
  return 'pending';
}
