'use client';

import { usePathname } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface AdminShellProps {
  children: React.ReactNode;
  pendingReviews?: number;
}

export default function AdminShell({ children, pendingReviews = 0 }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="admin-app">
      <AdminSidebar pendingReviews={pendingReviews} />
      <div className="admin-main">
        <AdminHeader pathname={pathname} />
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
