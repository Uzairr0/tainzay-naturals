import type { Metadata } from 'next';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { fetchAdminDashboard } from '@/lib/admin-dashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const { data, error } = await fetchAdminDashboard();

  return <AdminDashboard stats={data} error={error} />;
}
