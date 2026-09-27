'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  ADMIN_ORDER_STATUSES,
  ADMIN_PAYMENT_STATUSES,
  formatOrderSource,
  formatOrderStatus,
  formatPaymentMethod,
  formatPaymentStatus,
  getOrderSourceClass,
  getOrderStatusClass,
  getPaymentStatusClass,
  type AdminOrderStatus,
  type AdminPaymentStatus,
} from '@/lib/admin-orders';
import { quotesApi } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import { formatReviewDate } from '@/lib/reviews';
import type { QuoteRequest } from '@/types';

interface AdminOrderDetailProps {
  order: QuoteRequest;
}

export default function AdminOrderDetail({ order: initialOrder }: AdminOrderDetailProps) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [status, setStatus] = useState<AdminOrderStatus>(order.status ?? 'pending');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<AdminPaymentStatus>(
    order.paymentStatus ?? 'awaiting_verification',
  );
  const [isSavingPayment, setIsSavingPayment] = useState(false);

  async function handlePaymentSave(event: React.FormEvent) {
    event.preventDefault();
    if (!order._id) return;

    setIsSavingPayment(true);
    setSaveError('');
    setSaveSuccess('');

    try {
      const response = await quotesApi.updatePaymentStatus(order._id, paymentStatus);
      setOrder(response.data);
      setPaymentStatus(response.data.paymentStatus ?? paymentStatus);
      setSaveSuccess('Payment status updated.');
      router.refresh();
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update payment status.';
      setSaveError(message);
    } finally {
      setIsSavingPayment(false);
    }
  }

  async function handleStatusSave(event: React.FormEvent) {
    event.preventDefault();
    if (!order._id) return;

    setIsSaving(true);
    setSaveError('');
    setSaveSuccess('');

    try {
      const response = await quotesApi.updateStatus(order._id, status);
      const { stockChanges, ...updatedOrder } = response.data;
      setOrder(updatedOrder);
      setStatus(updatedOrder.status ?? status);
      setSaveSuccess(
        stockChanges.length > 0
          ? `Order status updated. Stock updated: ${stockChanges
              .map((change) => `${change.productName} ${change.before} → ${change.after}`)
              .join(', ')}.`
          : 'Order status updated.',
      );
      router.refresh();
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update order status.';
      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="admin-order-detail">
      <Link href="/admin/orders" className="admin-back-link">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to orders
      </Link>

      <section className="admin-order-detail-head">
        <div>
          <p className="admin-order-detail-eyebrow">Order detail</p>
          <h2 className="admin-order-detail-title">{order.orderNumber ?? 'Order'}</h2>
          <div className="admin-order-detail-meta">
            {order.createdAt && (
              <time dateTime={order.createdAt}>{formatReviewDate(order.createdAt)}</time>
            )}
            <span className={getOrderSourceClass(order.source)}>{formatOrderSource(order.source)}</span>
            <span className={getOrderStatusClass(order.status)}>{formatOrderStatus(order.status)}</span>
            {order.paymentStatus && (
              <span className={getPaymentStatusClass(order.paymentStatus)}>
                Payment: {formatPaymentStatus(order.paymentStatus)}
              </span>
            )}
          </div>
        </div>

        <form className="admin-order-status-form" onSubmit={handleStatusSave}>
          <label className="admin-order-status-field" htmlFor="order-status">
            <span className="admin-form-label">Update status</span>
            <select
              id="order-status"
              className="admin-form-select"
              value={status}
              disabled={isSaving}
              onChange={(event) => setStatus(event.target.value as AdminOrderStatus)}
            >
              {ADMIN_ORDER_STATUSES.map((option) => (
                <option key={option} value={option}>
                  {formatOrderStatus(option)}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="admin-action-btn admin-action-btn-approve" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save status'}
          </button>
        </form>
      </section>

      {saveError && (
        <div className="admin-alert admin-alert-error" role="alert">
          {saveError}
        </div>
      )}

      {saveSuccess && (
        <div className="admin-alert admin-alert-success" role="status">
          {saveSuccess}
        </div>
      )}

      <div className="admin-order-detail-grid">
        <section className="admin-detail-card">
          <h3 className="admin-detail-card-title">Customer</h3>
          <dl className="admin-detail-list">
            <div>
              <dt>Name</dt>
              <dd>{order.contactPerson}</dd>
            </div>
            {order.companyName && (
              <div>
                <dt>Company</dt>
                <dd>{order.companyName}</dd>
              </div>
            )}
            <div>
              <dt>Email</dt>
              <dd>{order.email}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{order.phone}</dd>
            </div>
            {order.whatsappNumber && (
              <div>
                <dt>WhatsApp</dt>
                <dd>{order.whatsappNumber}</dd>
              </div>
            )}
            {order.address && (
              <div>
                <dt>Address</dt>
                <dd>{order.address}</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="admin-detail-card">
          <h3 className="admin-detail-card-title">Payment</h3>
          <dl className="admin-detail-list">
            <div>
              <dt>Order total</dt>
              <dd>{typeof order.orderTotal === 'number' ? formatPrice(order.orderTotal) : '—'}</dd>
            </div>
            <div>
              <dt>Payment method</dt>
              <dd>{formatPaymentMethod(order)}</dd>
            </div>
            {order.paymentReference && (
              <div>
                <dt>Transaction ID</dt>
                <dd>{order.paymentReference}</dd>
              </div>
            )}
            {order.paymentStatus && (
              <div>
                <dt>Payment status</dt>
                <dd>
                  <span className={getPaymentStatusClass(order.paymentStatus)}>
                    {formatPaymentStatus(order.paymentStatus)}
                  </span>
                </dd>
              </div>
            )}
            <div>
              <dt>Source</dt>
              <dd>{formatOrderSource(order.source)}</dd>
            </div>
          </dl>

          {order.source === 'checkout' && (
            <form className="admin-order-status-form admin-payment-status-form" onSubmit={handlePaymentSave}>
              <label className="admin-order-status-field" htmlFor="order-payment-status">
                <span className="admin-form-label">Payment status</span>
                <select
                  id="order-payment-status"
                  className="admin-form-select"
                  value={paymentStatus}
                  disabled={isSavingPayment}
                  onChange={(event) => setPaymentStatus(event.target.value as AdminPaymentStatus)}
                >
                  {ADMIN_PAYMENT_STATUSES.map((option) => (
                    <option key={option} value={option}>
                      {formatPaymentStatus(option)}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className="admin-action-btn admin-action-btn-approve"
                disabled={isSavingPayment}
              >
                {isSavingPayment ? 'Saving…' : 'Save payment'}
              </button>
            </form>
          )}
        </section>
      </div>

      <section className="admin-panel admin-order-items-panel">
        <div className="admin-panel-head">
          <h3 className="admin-panel-title">Line items</h3>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table admin-order-items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={`${item.product}-${index}`}>
                  <td data-label="Product">{item.productName}</td>
                  <td data-label="Quantity">{item.quantity}</td>
                  <td data-label="Price">
                    {typeof item.requestedPrice === 'number'
                      ? formatPrice(item.requestedPrice)
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {order.message && (
        <section className="admin-detail-card">
          <h3 className="admin-detail-card-title">Message</h3>
          <p className="admin-order-message">{order.message}</p>
        </section>
      )}
    </div>
  );
}
