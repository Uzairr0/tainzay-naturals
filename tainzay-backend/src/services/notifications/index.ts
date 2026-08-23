import type { IQuoteRequest } from '../../models/QuoteRequest';
import { getOrCreateSiteSettings } from '../siteSettings';
import { sendOrderEmail, getEmailProviderLabel, isEmailConfigured } from './emailProvider';
import { sendOrderWhatsApp, getWhatsAppProviderLabel, isWhatsAppConfigured } from './whatsappProvider';
import {
  buildAdminOrderAlertEmail,
  buildAdminOrderAlertMessage,
  buildOrderReceivedEmail,
} from './orderMessage';

export {
  buildOrderReceivedMessage,
  buildOrderReceivedEmail,
  buildAdminOrderAlertMessage,
  buildAdminOrderAlertEmail,
} from './orderMessage';

export function logNotificationConfig(): void {
  console.log(
    `[notifications] email: ${getEmailProviderLabel()} | whatsapp: ${getWhatsAppProviderLabel()}`,
  );
}

/** Customer-facing order confirmation (checkout orders only) */
export async function sendCustomerOrderConfirmation(quote: IQuoteRequest): Promise<void> {
  if (quote.source !== 'checkout') return;

  const emailContent = buildOrderReceivedEmail(quote);

  try {
    const result = await sendOrderEmail(
      quote.email,
      emailContent.subject,
      emailContent.text,
      emailContent.html,
    );
    if (result === 'sent') {
      console.log(`[order-notification:customer-email] sent to ${quote.email}`);
    }
  } catch (error) {
    console.error('[order-notification:customer-email]', error);
  }
}

/** Admin alerts when a new order or quote is submitted */
export async function sendAdminOrderNotifications(quote: IQuoteRequest): Promise<void> {
  const settings = await getOrCreateSiteSettings();
  const adminEmailContent = buildAdminOrderAlertEmail(quote);
  const adminWhatsAppMessage = buildAdminOrderAlertMessage(quote);

  const tasks: Promise<unknown>[] = [];

  if (settings.notifyEmailOnOrder) {
    tasks.push(
      sendOrderEmail(
        settings.supportEmail,
        adminEmailContent.subject,
        adminEmailContent.text,
        adminEmailContent.html,
      ),
    );
  }

  if (settings.notifyWhatsAppOnOrder) {
    tasks.push(sendOrderWhatsApp(settings.whatsappPhone, adminWhatsAppMessage));
  }

  if (tasks.length === 0) return;

  const results = await Promise.allSettled(tasks);

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      const channels = [];
      if (settings.notifyEmailOnOrder) channels.push('admin-email');
      if (settings.notifyWhatsAppOnOrder) channels.push('admin-whatsapp');
      const channel = channels[index] ?? 'admin-notification';
      console.error(`[order-notification:${channel}]`, result.reason);
    } else if (result.value === 'sent') {
      const channels = [];
      if (settings.notifyEmailOnOrder) channels.push('admin-email');
      if (settings.notifyWhatsAppOnOrder) channels.push('admin-whatsapp');
      const channel = channels[index] ?? 'admin-notification';
      const target =
        channel === 'admin-email' ? settings.supportEmail : settings.whatsappPhone;
      console.log(`[order-notification:${channel}] sent to ${target}`);
    }
  });
}

/** @deprecated Use sendCustomerOrderConfirmation + sendAdminOrderNotifications */
export async function sendOrderReceivedNotifications(quote: IQuoteRequest): Promise<void> {
  await sendCustomerOrderConfirmation(quote);
  await sendAdminOrderNotifications(quote);
}

export function getNotificationStatus() {
  return {
    email: { configured: isEmailConfigured(), provider: getEmailProviderLabel() },
    whatsapp: { configured: isWhatsAppConfigured(), provider: getWhatsAppProviderLabel() },
  };
}
