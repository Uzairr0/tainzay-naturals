import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { ADMIN_SESSION_COOKIE } from '@/lib/admin-auth';

export const metadata = {
  title: 'Admin Login',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const expected = process.env.ADMIN_SESSION_SECRET;

  if (session && expected && session === expected) {
    redirect('/admin');
  }

  return (
    <Suspense fallback={<div className="admin-login-page admin-login-page-loading" />}>
      <AdminLoginForm />
    </Suspense>
  );
}
