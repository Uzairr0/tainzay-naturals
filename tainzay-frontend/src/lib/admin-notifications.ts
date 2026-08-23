import { adminApi } from '@/lib/api';
import type { Fetched } from '@/lib/catalogue';
import type { AdminNotificationsResponse } from '@/types';

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

const emptyNotifications = (): AdminNotificationsResponse => ({
  pendingCount: 0,
  orders: [],
});

export async function fetchAdminNotifications(): Promise<Fetched<AdminNotificationsResponse>> {
  try {
    const response = await adminApi.getNotifications();
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Failed to fetch admin notifications:', describeError(error));
    return { data: emptyNotifications(), error: describeError(error) };
  }
}

export function formatNotificationTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString('en-PK', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatOrderAmount(amount?: number): string {
  if (typeof amount !== 'number') return '—';
  return `Rs.${Math.round(amount).toLocaleString('en-PK')}`;
}
