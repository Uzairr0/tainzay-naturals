import type { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import {
  buildNewOrderNotification,
  getAdminNotificationsPayload,
  type serializeNotificationOrder,
} from './adminNotifications';
import type { IQuoteRequest } from '../models/QuoteRequest';

type NotificationOrder = ReturnType<typeof serializeNotificationOrder>;

export type AdminRealtimeEvent =
  | {
      type: 'notifications:sync';
      payload: { pendingCount: number; orders: NotificationOrder[] };
    }
  | {
      type: 'order:new';
      payload: { pendingCount: number; order: NotificationOrder };
    };

const clients = new Set<WebSocket>();

function isAuthorized(token: string | null): boolean {
  const expected = process.env.ADMIN_SESSION_SECRET;
  return Boolean(expected && token && token === expected);
}

function sendEvent(client: WebSocket, event: AdminRealtimeEvent): void {
  if (client.readyState !== WebSocket.OPEN) return;
  client.send(JSON.stringify(event));
}

export function broadcastAdminEvent(event: AdminRealtimeEvent): void {
  for (const client of clients) {
    sendEvent(client, event);
  }
}

async function sendSyncToClient(client: WebSocket): Promise<void> {
  const payload = await getAdminNotificationsPayload();
  sendEvent(client, { type: 'notifications:sync', payload });
}

export async function broadcastNewOrder(quote: IQuoteRequest): Promise<void> {
  const payload = await buildNewOrderNotification(quote);
  broadcastAdminEvent({ type: 'order:new', payload });
}

export function initAdminRealtime(server: Server): void {
  const wss = new WebSocketServer({ server, path: '/ws/admin' });

  wss.on('connection', (client, request) => {
    const requestUrl = request.url ?? '';
    const token = new URL(requestUrl, 'http://localhost').searchParams.get('token');

    if (!isAuthorized(token)) {
      client.close(4401, 'Unauthorized');
      return;
    }

    clients.add(client);

    void sendSyncToClient(client).catch((error) => {
      console.error('[admin-realtime:sync]', error);
    });

    client.on('close', () => {
      clients.delete(client);
    });

    client.on('error', (error) => {
      console.error('[admin-realtime:client]', error);
      clients.delete(client);
    });
  });

  console.log('[admin-realtime] WebSocket listening on /ws/admin');
}
