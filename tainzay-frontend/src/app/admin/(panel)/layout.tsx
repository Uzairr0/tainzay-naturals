import AdminShell from '@/components/admin/AdminShell';
import { fetchPendingReviewCount } from '@/lib/admin-reviews';

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const pendingReviews = await fetchPendingReviewCount();

  return <AdminShell pendingReviews={pendingReviews}>{children}</AdminShell>;
}
