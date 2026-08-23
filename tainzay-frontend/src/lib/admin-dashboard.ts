import { adminApi } from '@/lib/api';
import type { Fetched } from '@/lib/catalogue';
import type { AdminDashboardStats } from '@/types';

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

const EMPTY_DASHBOARD: AdminDashboardStats = {
  kpis: {
    ordersThisWeek: 0,
    ordersThisMonth: 0,
    revenueThisMonth: 0,
    pendingReviews: 0,
    averageOrderValue: 0,
    outOfStockProducts: 0,
  },
  recentOrders: [],
  pendingReviews: [],
};

export async function fetchAdminDashboard(): Promise<Fetched<AdminDashboardStats>> {
  try {
    const response = await adminApi.getDashboard();
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Failed to fetch admin dashboard:', describeError(error));
    return { data: EMPTY_DASHBOARD, error: describeError(error) };
  }
}
