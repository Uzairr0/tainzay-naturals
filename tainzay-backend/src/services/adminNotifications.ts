import QuoteRequest, { type IQuoteRequest } from '../models/QuoteRequest';

export function summarizeOrderItems(items: Array<{ productName?: string }>): string {
  if (!items.length) return 'Order items';
  if (items.length === 1) return items[0]?.productName ?? 'Order items';
  return `${items[0]?.productName ?? 'Item'} +${items.length - 1} more`;
}

export function serializeNotificationOrder(order: {
  _id: unknown;
  orderNumber?: string;
  contactPerson: string;
  orderTotal?: number;
  status: string;
  source?: string;
  createdAt: Date;
  items: Array<{ productName?: string }>;
}) {
  return {
    _id: String(order._id),
    orderNumber: order.orderNumber,
    contactPerson: order.contactPerson,
    orderTotal: order.orderTotal,
    status: order.status,
    source: order.source,
    createdAt: order.createdAt.toISOString(),
    productSummary: summarizeOrderItems(order.items),
  };
}

export async function getAdminNotificationsPayload() {
  const [pendingCount, recentOrders] = await Promise.all([
    QuoteRequest.countDocuments({ status: 'pending' }),
    QuoteRequest.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .select('orderNumber contactPerson orderTotal status source createdAt items'),
  ]);

  return {
    pendingCount,
    orders: recentOrders.map((order) => serializeNotificationOrder(order)),
  };
}

export async function buildNewOrderNotification(quote: IQuoteRequest) {
  const pendingCount = await QuoteRequest.countDocuments({ status: 'pending' });

  return {
    pendingCount,
    order: serializeNotificationOrder(quote),
  };
}
