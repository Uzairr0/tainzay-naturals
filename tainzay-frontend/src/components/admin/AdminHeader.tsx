'use client';

import { Maximize2, Moon, Search } from 'lucide-react';
import AdminNotificationBell from '@/components/admin/AdminNotificationBell';
import { getAdminPageTitle } from '@/lib/admin-nav';

interface AdminHeaderProps {
  pathname: string;
}

export default function AdminHeader({ pathname }: AdminHeaderProps) {
  const title = getAdminPageTitle(pathname);

  return (
    <header className="admin-header">
      <div className="admin-header-copy">
        <p className="admin-header-eyebrow">Admin</p>
        <h1 className="admin-header-title">{title}</h1>
      </div>

      <div className="admin-header-actions">
        <label className="admin-search" aria-label="Search admin">
          <Search size={18} aria-hidden="true" />
          <input type="search" placeholder="Search" disabled />
        </label>

        <AdminNotificationBell />

        <div className="admin-header-icons">
          <button type="button" className="admin-icon-btn" disabled aria-hidden="true">
            <Maximize2 size={18} />
          </button>
          <button type="button" className="admin-icon-btn" disabled aria-hidden="true">
            <Moon size={18} />
          </button>
        </div>

        <div className="admin-user-chip" aria-label="Admin user">
          <span className="admin-user-avatar">A</span>
        </div>
      </div>
    </header>
  );
}
