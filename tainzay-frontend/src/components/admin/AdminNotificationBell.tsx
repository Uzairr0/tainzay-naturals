'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, ShoppingBag } from 'lucide-react';
import clsx from 'clsx';
import {
  fetchAdminNotifications,
  formatNotificationTime,
  formatOrderAmount,
} from '@/lib/admin-notifications';
import { useAdminRealtime } from '@/hooks/useAdminRealtime';
import type { AdminNotificationOrder } from '@/types';

export default function AdminNotificationBell() {
  const [open, setOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [orders, setOrders] = useState<AdminNotificationOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const loadNotifications = useCallback(async () => {
    const { data } = await fetchAdminNotifications();
    setPendingCount(data.pendingCount);
    setOrders(data.orders);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  useAdminRealtime({
    onSync: (payload) => {
      setPendingCount(payload.pendingCount);
      setOrders(payload.orders);
      setLoading(false);
    },
    onNewOrder: (payload) => {
      setPendingCount(payload.pendingCount);
      setOrders((current) => {
        const filtered = current.filter((order) => order._id !== payload.order._id);
        return [payload.order, ...filtered].slice(0, 8);
      });
      setLoading(false);
    },
    onConnectionChange: setLive,
    onFallback: () => {
      void loadNotifications();
    },
  });

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="admin-notifications" ref={panelRef}>
      <button
        type="button"
        className={clsx('admin-icon-btn', open && 'is-active')}
        aria-label={`Notifications${pendingCount > 0 ? `, ${pendingCount} pending orders` : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <Bell size={18} />
        {pendingCount > 0 && (
          <span className="admin-notifications-badge">{pendingCount > 99 ? '99+' : pendingCount}</span>
        )}
        {live && <span className="admin-notifications-live" aria-label="Live updates connected" />}
      </button>

      {open && (
        <div className="admin-notifications-panel" role="dialog" aria-label="Order notifications">
          <div className="admin-notifications-header">
            <div>
              <h2 className="admin-notifications-title">Notifications</h2>
              {live && <span className="admin-notifications-live-label">Live</span>}
            </div>
            {pendingCount > 0 && (
              <span className="admin-notifications-pending">{pendingCount} pending</span>
            )}
          </div>

          {loading ? (
            <p className="admin-notifications-empty">Loading…</p>
          ) : orders.length === 0 ? (
            <p className="admin-notifications-empty">No orders yet.</p>
          ) : (
            <ul className="admin-notifications-list">
              {orders.map((order) => (
                <li key={order._id}>
                  <Link
                    href={`/admin/orders/${order._id}`}
                    className="admin-notifications-item"
                    onClick={() => setOpen(false)}
                  >
                    <span className="admin-notifications-item-icon" aria-hidden="true">
                      <ShoppingBag size={16} />
                    </span>
                    <span className="admin-notifications-item-body">
                      <span className="admin-notifications-item-title">
                        {order.orderNumber ?? 'New order'} · {order.contactPerson}
                      </span>
                      <span className="admin-notifications-item-meta">
                        {order.productSummary} · {formatOrderAmount(order.orderTotal)}
                      </span>
                      <span className="admin-notifications-item-time">
                        {formatNotificationTime(order.createdAt)}
                        {order.source === 'checkout' ? ' · Checkout' : ' · Quote'}
                      </span>
                    </span>
                    {order.status === 'pending' && (
                      <span className="admin-notifications-item-dot" aria-label="Pending" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/admin/orders"
            className="admin-notifications-footer"
            onClick={() => setOpen(false)}
          >
            View all orders
          </Link>
        </div>
      )}
    </div>
  );
}
