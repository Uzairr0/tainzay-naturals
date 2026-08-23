'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ADMIN_NAV_ITEMS, type AdminNavItem } from '@/lib/admin-nav';
import { SITE } from '@/lib/site-config';

interface AdminSidebarProps {
  pendingReviews?: number;
}

function NavLink({
  item,
  pathname,
  pendingReviews,
  onNavigate,
}: {
  item: AdminNavItem;
  pathname: string;
  pendingReviews: number;
  onNavigate?: () => void;
}) {
  const isActive =
    item.href === '/admin'
      ? pathname === '/admin' || pathname === '/admin/'
      : pathname.startsWith(item.href);

  const badge =
    item.badgeKey === 'pendingReviews' && pendingReviews > 0 ? pendingReviews : null;

  const className = clsx(
    'admin-nav-link',
    isActive && 'is-active',
    item.disabled && 'is-disabled',
  );

  const content = (
    <>
      <item.icon size={18} aria-hidden="true" />
      <span>{item.label}</span>
      {badge !== null && <span className="admin-nav-badge">{badge}</span>}
      {item.disabled && <span className="admin-nav-soon">Soon</span>}
    </>
  );

  if (item.disabled) {
    return (
      <span className={className} aria-disabled="true">
        {content}
      </span>
    );
  }

  return (
    <Link href={item.href} className={className} onClick={onNavigate}>
      {content}
    </Link>
  );
}

export default function AdminSidebar({ pendingReviews = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const generalItems = ADMIN_NAV_ITEMS.filter((item) => item.section === 'general');
  const accountItems = ADMIN_NAV_ITEMS.filter((item) => item.section === 'account');

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  return (
    <>
      <button
        type="button"
        className="admin-mobile-toggle"
        aria-label={mobileOpen ? 'Close admin menu' : 'Open admin menu'}
        onClick={() => setMobileOpen((open) => !open)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileOpen && (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          aria-label="Close admin menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={clsx('admin-sidebar', mobileOpen && 'is-open')}>
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-logo" aria-hidden="true">
            {SITE.name.charAt(0)}
          </div>
          <div>
            <p className="admin-sidebar-brand-name">{SITE.name}</p>
            <p className="admin-sidebar-brand-tag">Admin Panel</p>
          </div>
        </div>

        <nav className="admin-sidebar-nav" aria-label="Admin navigation">
          <p className="admin-nav-section-label">General</p>
          {generalItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              pendingReviews={pendingReviews}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}

          <p className="admin-nav-section-label">Account</p>
          {accountItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              pendingReviews={pendingReviews}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}
        </nav>

        <button type="button" className="admin-logout-btn" onClick={handleLogout}>
          <LogOut size={18} aria-hidden="true" />
          Logout
        </button>
      </aside>
    </>
  );
}
