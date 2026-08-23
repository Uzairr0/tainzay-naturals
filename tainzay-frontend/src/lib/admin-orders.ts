import { quotesApi } from '@/lib/api';
import type { Fetched } from '@/lib/catalogue';
import type { QuoteRequest } from '@/types';

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

export type AdminOrderStatus = NonNullable<QuoteRequest['status']>;
export type AdminOrderSource = NonNullable<QuoteRequest['source']>;

export const ADMIN_ORDER_STATUSES: AdminOrderStatus[] = [
  'pending',
  'reviewed',
  'responded',
  'closed',
];

export const ADMIN_ORDER_SOURCES: AdminOrderSource[] = ['checkout', 'quote'];

export function parseAdminOrderStatus(value: string | undefined): AdminOrderStatus | 'all' {
  if (value && ADMIN_ORDER_STATUSES.includes(value as AdminOrderStatus)) {
    return value as AdminOrderStatus;
  }
  return 'all';
}

export function parseAdminOrderSource(value: string | undefined): AdminOrderSource | 'all' {
  if (value && ADMIN_ORDER_SOURCES.includes(value as AdminOrderSource)) {
    return value as AdminOrderSource;
  }
  return 'all';
}

export function getOrderStatusClass(status?: QuoteRequest['status']) {
  switch (status) {
    case 'reviewed':
      return 'admin-status admin-status-reviewed';
    case 'responded':
      return 'admin-status admin-status-responded';
    case 'closed':
      return 'admin-status admin-status-closed';
    default:
      return 'admin-status admin-status-pending';
  }
}

export function formatOrderStatus(status?: QuoteRequest['status']) {
  switch (status) {
    case 'reviewed':
      return 'Reviewed';
    case 'responded':
      return 'Responded';
    case 'closed':
      return 'Closed';
    default:
      return 'Pending';
  }
}

export function formatOrderSource(source?: QuoteRequest['source']) {
  return source === 'checkout' ? 'Checkout' : 'Quote';
}

export function getOrderSourceClass(source?: QuoteRequest['source']) {
  return source === 'checkout'
    ? 'admin-source admin-source-checkout'
    : 'admin-source admin-source-quote';
}

export async function fetchAdminOrders(params?: {
  status?: AdminOrderStatus;
  source?: AdminOrderSource;
}): Promise<Fetched<QuoteRequest[]>> {
  try {
    const response = await quotesApi.getAll(params);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Failed to fetch admin orders:', describeError(error));
    return { data: [], error: describeError(error) };
  }
}

export async function fetchAdminOrder(id: string): Promise<Fetched<QuoteRequest | null>> {
  try {
    const response = await quotesApi.getById(id);
    return { data: response.data, error: null };
  } catch (error) {
    console.error(`Failed to fetch order ${id}:`, describeError(error));
    return { data: null, error: describeError(error) };
  }
}

export function summarizeOrderItems(items: QuoteRequest['items']): string {
  if (!items.length) return 'No items';
  if (items.length === 1) return items[0]?.productName ?? 'Item';
  return `${items[0]?.productName ?? 'Item'} +${items.length - 1} more`;
}

export function buildOrdersListHref(params: {
  status?: AdminOrderStatus | 'all';
  source?: AdminOrderSource | 'all';
}) {
  const search = new URLSearchParams();
  if (params.status && params.status !== 'all') search.set('status', params.status);
  if (params.source && params.source !== 'all') search.set('source', params.source);
  const query = search.toString();
  return query ? `/admin/orders?${query}` : '/admin/orders';
}
