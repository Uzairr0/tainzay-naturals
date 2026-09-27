import Link from 'next/link';
import StarRating from '@/components/shared/StarRating';
import {
  formatOrderStatus,
  getOrderStatusClass,
} from '@/lib/admin-orders';
import { formatPrice } from '@/lib/format';
import { formatReviewDate } from '@/lib/reviews';
import type { AdminDashboardStats } from '@/types';

interface AdminDashboardProps {
  stats: AdminDashboardStats;
  error?: string | null;
}

interface KpiCardProps {
  label: string;
  value: string;
  hint: string;
  tone: 'peach' | 'green' | 'blue' | 'lavender' | 'pink';
}

const KPI_CARDS: Array<{
  key: keyof AdminDashboardStats['kpis'];
  label: string;
  hint: string;
  tone: KpiCardProps['tone'];
  format: (value: number) => string;
}> = [
  {
    key: 'ordersThisWeek',
    label: 'Orders This Week',
    hint: 'Checkout orders',
    tone: 'peach',
    format: (value) => String(value),
  },
  {
    key: 'revenueThisMonth',
    label: 'Revenue This Month',
    hint: 'Closed (dispatched) orders',
    tone: 'green',
    format: (value) => formatPrice(value),
  },
  {
    key: 'pendingReviews',
    label: 'Pending Reviews',
    hint: 'Needs approval',
    tone: 'blue',
    format: (value) => String(value),
  },
  {
    key: 'averageOrderValue',
    label: 'Average Order Value',
    hint: 'Closed orders this month',
    tone: 'lavender',
    format: (value) => formatPrice(value),
  },
  {
    key: 'outOfStockProducts',
    label: 'Out of Stock',
    hint: 'Products unavailable',
    tone: 'pink',
    format: (value) => String(value),
  },
];

export default function AdminDashboard({ stats, error }: AdminDashboardProps) {
  const { kpis, recentOrders, pendingReviews } = stats;

  return (
    <div className="admin-dashboard">
      <section className="admin-dashboard-welcome">
        <h2 className="admin-dashboard-welcome-title">Welcome back</h2>
        <p className="admin-dashboard-welcome-text">
          Here&apos;s what&apos;s happening with Tainzy Naturals orders and customer reviews.
        </p>
      </section>

      {error && (
        <div className="admin-alert admin-alert-error" role="alert">
          We couldn&apos;t load live dashboard data. Showing empty values for now.
        </div>
      )}

      <section className="admin-kpi-grid" aria-label="Dashboard summary">
        {KPI_CARDS.map((card) => (
          <article key={card.key} className={`admin-kpi-card admin-kpi-card-${card.tone}`}>
            <p className="admin-kpi-label">{card.label}</p>
            <p className="admin-kpi-value">{card.format(kpis[card.key])}</p>
            <p className="admin-kpi-hint">{card.hint}</p>
          </article>
        ))}
      </section>

      <div className="admin-dashboard-grid">
        <section className="admin-panel">
          <div className="admin-panel-head">
            <h2 className="admin-panel-title">Recent Orders</h2>
            <Link href="/admin/orders" className="admin-panel-link">
              View all
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="admin-panel-empty">No checkout orders yet.</div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table admin-dashboard-orders-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Buyer</th>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td data-label="Product">{order.productSummary}</td>
                      <td data-label="Buyer">{order.contactPerson}</td>
                      <td data-label="Order ID">
                        <Link href={`/admin/orders/${order._id}`} className="admin-order-id-link">
                          {order.orderNumber ?? 'View order'}
                        </Link>
                      </td>
                      <td data-label="Date">
                        <time dateTime={order.createdAt}>{formatReviewDate(order.createdAt)}</time>
                      </td>
                      <td data-label="Total">
                        {typeof order.orderTotal === 'number'
                          ? formatPrice(order.orderTotal)
                          : '—'}
                      </td>
                      <td data-label="Status">
                        <span className={getOrderStatusClass(order.status)}>
                          {formatOrderStatus(order.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="admin-panel">
          <div className="admin-panel-head">
            <h2 className="admin-panel-title">Pending Reviews</h2>
            <Link href="/admin/reviews?status=pending" className="admin-panel-link">
              Manage
            </Link>
          </div>

          {pendingReviews.length === 0 ? (
            <div className="admin-panel-empty">No reviews waiting for approval.</div>
          ) : (
            <ul className="admin-pending-reviews">
              {pendingReviews.map((review) => (
                <li key={review._id} className="admin-pending-review-item">
                  <div className="admin-pending-review-head">
                    <StarRating rating={review.rating} size="sm" />
                    <time dateTime={review.createdAt}>{formatReviewDate(review.createdAt)}</time>
                  </div>
                  <p className="admin-pending-review-product">{review.productName}</p>
                  <p className="admin-pending-review-comment">{review.comment}</p>
                  <p className="admin-pending-review-author">{review.authorName}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
