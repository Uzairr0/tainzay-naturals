'use client';

import { useEffect, useRef } from 'react';
import type { AdminNotificationOrder, AdminNotificationsResponse } from '@/types';

export type AdminRealtimeEvent =
  | {
      type: 'notifications:sync';
      payload: AdminNotificationsResponse;
    }
  | {
      type: 'order:new';
      payload: { pendingCount: number; order: AdminNotificationOrder };
    };

const RECONNECT_MS = 3_000;
const FALLBACK_POLL_MS = 60_000;

function getAdminWebSocketUrl(token: string): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const url = new URL(apiUrl);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  url.pathname = '/ws/admin';
  url.searchParams.set('token', token);
  return url.toString();
}

interface UseAdminRealtimeOptions {
  onSync: (payload: AdminNotificationsResponse) => void;
  onNewOrder: (payload: { pendingCount: number; order: AdminNotificationOrder }) => void;
  onConnectionChange?: (connected: boolean) => void;
  onFallback?: () => void;
}

export function useAdminRealtime({
  onSync,
  onNewOrder,
  onConnectionChange,
  onFallback,
}: UseAdminRealtimeOptions) {
  const handlersRef = useRef({ onSync, onNewOrder, onConnectionChange, onFallback });
  handlersRef.current = { onSync, onNewOrder, onConnectionChange, onFallback };

  useEffect(() => {
    let cancelled = false;
    let ws: WebSocket | null = null;
    let reconnectTimer: number | null = null;
    let fallbackTimer: number | null = null;

    function clearReconnectTimer() {
      if (reconnectTimer !== null) {
        window.clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    }

    function clearFallbackTimer() {
      if (fallbackTimer !== null) {
        window.clearInterval(fallbackTimer);
        fallbackTimer = null;
      }
    }

    function startFallbackPolling() {
      if (fallbackTimer !== null || !handlersRef.current.onFallback) return;
      fallbackTimer = window.setInterval(() => {
        handlersRef.current.onFallback?.();
      }, FALLBACK_POLL_MS);
    }

    function handleMessage(event: MessageEvent<string>) {
      try {
        const payload = JSON.parse(event.data) as AdminRealtimeEvent;
        if (payload.type === 'notifications:sync') {
          handlersRef.current.onSync(payload.payload);
        } else if (payload.type === 'order:new') {
          handlersRef.current.onNewOrder(payload.payload);
        }
      } catch (error) {
        console.error('[admin-realtime:parse]', error);
      }
    }

    async function connect() {
      if (cancelled) return;

      try {
        const response = await fetch('/api/admin/ws-auth');
        if (!response.ok) {
          handlersRef.current.onConnectionChange?.(false);
          startFallbackPolling();
          clearReconnectTimer();
          reconnectTimer = window.setTimeout(connect, RECONNECT_MS);
          return;
        }

        const { token } = (await response.json()) as { token: string };
        if (cancelled) return;

        ws = new WebSocket(getAdminWebSocketUrl(token));

        ws.addEventListener('open', () => {
          handlersRef.current.onConnectionChange?.(true);
          clearFallbackTimer();
        });

        ws.addEventListener('message', handleMessage);

        ws.addEventListener('close', () => {
          handlersRef.current.onConnectionChange?.(false);
          ws = null;
          startFallbackPolling();
          if (!cancelled) {
            clearReconnectTimer();
            reconnectTimer = window.setTimeout(connect, RECONNECT_MS);
          }
        });

        ws.addEventListener('error', () => {
          ws?.close();
        });
      } catch (error) {
        console.error('[admin-realtime:connect]', error);
        handlersRef.current.onConnectionChange?.(false);
        startFallbackPolling();
        if (!cancelled) {
          clearReconnectTimer();
          reconnectTimer = window.setTimeout(connect, RECONNECT_MS);
        }
      }
    }

    void connect();

    return () => {
      cancelled = true;
      clearReconnectTimer();
      clearFallbackTimer();
      ws?.close();
    };
  }, []);
}
