import type { Metadata } from 'next';
import AdminOrdersManager from '@/components/admin/AdminOrdersManager';
import {
  fetchAdminOrders,
  parseAdminOrderSource,
  parseAdminOrderStatus,
} from '@/lib/admin-orders';

export const metadata: Metadata = {
  title: 'Orders',
  robots: { index: false, follow: false },
};

interface AdminOrdersPageProps {
  searchParams: Promise<{ status?: string; source?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const { status: statusParam, source: sourceParam } = await searchParams;
  const statusFilter = parseAdminOrderStatus(statusParam);
  const sourceFilter = parseAdminOrderSource(sourceParam);

  const { data: orders, error } = await fetchAdminOrders({
    status: statusFilter === 'all' ? undefined : statusFilter,
    source: sourceFilter === 'all' ? undefined : sourceFilter,
  });

  return (
    <AdminOrdersManager
      key={`${statusFilter}-${sourceFilter}`}
      orders={orders}
      initialStatus={statusFilter}
      initialSource={sourceFilter}
      error={error}
    />
  );
}
