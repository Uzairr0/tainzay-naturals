import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Star,
} from 'lucide-react';

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badgeKey?: 'pendingReviews';
  disabled?: boolean;
  section?: 'general' | 'account';
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    section: 'general',
  },
  {
    label: 'Orders',
    href: '/admin/orders',
    icon: ShoppingBag,
    section: 'general',
  },
  {
    label: 'Reviews',
    href: '/admin/reviews',
    icon: Star,
    badgeKey: 'pendingReviews',
    section: 'general',
  },
  {
    label: 'Products',
    href: '/admin/products',
    icon: Package,
    section: 'general',
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    section: 'account',
  },
];

export function getAdminPageTitle(pathname: string): string {
  if (pathname === '/admin' || pathname === '/admin/') return 'Dashboard';
  if (pathname.startsWith('/admin/orders/') && pathname !== '/admin/orders') return 'Order Detail';
  if (pathname.startsWith('/admin/orders')) return 'Orders';
  if (pathname.startsWith('/admin/reviews')) return 'Reviews';
  if (pathname.startsWith('/admin/products/') && pathname !== '/admin/products') return 'Edit Product';
  if (pathname.startsWith('/admin/products')) return 'Products';
  if (pathname.startsWith('/admin/settings')) return 'Settings';
  return 'Admin';
}
