import type { Metadata } from 'next';
import AdminReviewsManager from '@/components/admin/AdminReviewsManager';
import { fetchAdminReviews, parseAdminReviewStatus } from '@/lib/admin-reviews';

export const metadata: Metadata = {
  title: 'Reviews',
  robots: { index: false, follow: false },
};

interface AdminReviewsPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminReviewsPage({ searchParams }: AdminReviewsPageProps) {
  const { status: statusParam } = await searchParams;
  const status = parseAdminReviewStatus(statusParam);
  const { data: reviews, error } = await fetchAdminReviews(status);

  return (
    <AdminReviewsManager
      key={status}
      initialReviews={reviews}
      initialStatus={status}
      error={error}
    />
  );
}
