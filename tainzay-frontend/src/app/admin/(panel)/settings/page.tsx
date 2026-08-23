import type { Metadata } from 'next';
import AdminSettingsForm from '@/components/admin/AdminSettingsForm';
import { fetchAdminSettings } from '@/lib/site-settings';

export const metadata: Metadata = {
  title: 'Settings',
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const { data, error } = await fetchAdminSettings();

  return <AdminSettingsForm initialData={data} error={error} />;
}
