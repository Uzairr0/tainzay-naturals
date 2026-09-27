'use client';

import Link from 'next/link';
import { Eye } from 'lucide-react';
import clsx from 'clsx';
import {
  buildOrdersListHref,
  formatOrderSource,
  formatOrderStatus,
  formatPaymentMethod,
  formatPaymentStatus,
  getOrderSourceClass,
  getOrderStatusClass,
  getPaymentStatusClass,
  summarizeOrderItems,
  type AdminOrderSource,
  type AdminOrderStatus,
} from '@/lib/admin-orders';
import { formatPrice } from '@/lib/format';
import { formatReviewDate } from '@/lib/reviews';
import type { QuoteRequest } from '@/types';

const STATUS_TABS: Array<{ id: AdminOrderStatus | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'reviewed', label: 'Reviewed' },
  { id: 'responded', label: 'Responded' },
  { id: 'closed', label: 'Closed' },
  { id: 'cancelled', label: 'Cancelled' },
];

const SOURCE_TABS: Array<{ id: AdminOrderSource | 'all'; label: string }> = [
  { id: 'all', label: 'All sources' },
  { id: 'checkout', label: 'Checkout' },
  { id: 'quote', label: 'Quote requests' },
];

interface AdminOrdersManagerProps {
  orders: QuoteRequest[];
  initialStatus: AdminOrderStatus | 'all';
  initialSource: AdminOrderSource | 'all';
  error?: string | null;
}

export default function AdminOrdersManager({
  orders,
  initialStatus,
  initialSource,
  error,
}: AdminOrdersManagerProps) {
  return (
    <div className="admin-orders">
      <div className="admin-orders-toolbar">
        <div className="admin-reviews-tabs" role="tablist" aria-label="Order status">
          {STATUS_TABS.map((tab) => {
            const isActive = initialStatus === tab.id;
            return (
              <Link
                key={tab.id}
                href={buildOrdersListHref({ status: tab.id, source: initialSource })}
                role="tab"
                aria-selected={isActive}
                className={clsx('admin-reviews-tab', isActive && 'is-active')}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <div className="admin-orders-source-tabs" role="tablist" aria-label="Order source">
          {SOURCE_TABS.map((tab) => {
            const isActive = initialSource === tab.id;
            return (
              <Link
                key={tab.id}
                href={buildOrdersListHref({ status: initialStatus, source: tab.id })}
                role="tab"
                aria-selected={isActive}
                className={clsx('admin-orders-source-tab', isActive && 'is-active')}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      <p className="admin-reviews-summary">
        {orders.length} order{orders.length === 1 ? '' : 's'}
      </p>

      {error && (
        <div className="admin-alert admin-alert-error" role="alert">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="admin-empty-state">
          <p>No orders match these filters.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table admin-orders-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Buyer</th>
                <th>Contact</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Source</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td data-label="Order #">{order.orderNumber ?? '—'}</td>
                  <td data-label="Buyer">
                    <div className="admin-order-buyer">
                      <span className="admin-order-buyer-name">{order.contactPerson}</span>
                      {order.companyName && (
                        <span className="admin-order-buyer-company">{order.companyName}</span>
                      )}
                    </div>
                  </td>
                  <td data-label="Contact">
                    <div className="admin-order-contact">
                      <span>{order.email}</span>
                      <span>{order.phone}</span>
                    </div>
                  </td>
                  <td data-label="Items">{summarizeOrderItems(order.items)}</td>
                  <td data-label="Total">
                    {typeof order.orderTotal === 'number' ? formatPrice(order.orderTotal) : '—'}
                  </td>
                  <td data-label="Date">
                    {order.createdAt ? (
                      <time dateTime={order.createdAt}>{formatReviewDate(order.createdAt)}</time>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td data-label="Source">
                    <span className={getOrderSourceClass(order.source)}>
                      {formatOrderSource(order.source)}
                    </span>
                  </td>
                  <td data-label="Payment">
                    {order.paymentStatus ? (
                      <span className={getPaymentStatusClass(order.paymentStatus)}>
                        {formatPaymentStatus(order.paymentStatus)}
                      </span>
                    ) : (
                      formatPaymentMethod(order)
                    )}
                  </td>
                  <td data-label="Status">
                    <span className={getOrderStatusClass(order.status)}>
                      {formatOrderStatus(order.status)}
                    </span>
                  </td>
                  <td data-label="Action">
                    {order._id ? (
                      <Link href={`/admin/orders/${order._id}`} className="admin-action-btn admin-action-btn-view">
                        <Eye size={16} aria-hidden="true" />
                        View
                      </Link>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
