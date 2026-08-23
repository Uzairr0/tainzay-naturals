import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdminOrderDetail from '@/components/admin/AdminOrderDetail';
import { fetchAdminOrder } from '@/lib/admin-orders';

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AdminOrderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const { data: order } = await fetchAdminOrder(id);

  return {
    title: order?.orderNumber ? `Order ${order.orderNumber}` : 'Order Detail',
    robots: { index: false, follow: false },
  };
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;
  const { data: order, error } = await fetchAdminOrder(id);

  if (!order) {
    if (error) {
      return (
        <div className="admin-empty-state">
          <p>We couldn&apos;t load this order.</p>
          <Link href="/admin/orders" className="admin-panel-link">
            Back to orders
          </Link>
        </div>
      );
    }

    notFound();
  }

  return <AdminOrderDetail order={order} />;
}
