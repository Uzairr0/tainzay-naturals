import { cache } from 'react';
import { fetchServerJsonCached, REVALIDATE, toQueryRecord } from '@/lib/server-api';
import type { ReviewListResponse } from '@/types';
import type { Fetched } from '@/lib/catalogue';

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

const emptyList = (limit: number): ReviewListResponse => ({
  reviews: [],
  pagination: { page: 1, limit, total: 0, totalPages: 1 },
});

export async function fetchApprovedReviews(params?: {
  page?: number;
  limit?: number;
  product?: string;
}): Promise<Fetched<ReviewListResponse>> {
  try {
    const data = await fetchServerJsonCached<ReviewListResponse>(
      '/reviews/approved',
      REVALIDATE.reviews,
      toQueryRecord({
        page: params?.page,
        limit: params?.limit,
        product: params?.product,
      }),
    );
    return { data, error: null };
  } catch (error) {
    console.error('Failed to fetch reviews:', describeError(error));
    return { data: emptyList(params?.limit ?? 20), error: describeError(error) };
  }
}

export const fetchProductReviews = cache(async (
  slug: string,
  limit = 5,
): Promise<Fetched<ReviewListResponse>> => {
  try {
    const data = await fetchServerJsonCached<ReviewListResponse>(
      `/reviews/product/${slug}`,
      REVALIDATE.reviews,
      { page: 1, limit },
    );
    return { data, error: null };
  } catch (error) {
    console.error(`Failed to fetch reviews for ${slug}:`, describeError(error));
    return { data: emptyList(limit), error: describeError(error) };
  }
});

export function formatReviewDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
