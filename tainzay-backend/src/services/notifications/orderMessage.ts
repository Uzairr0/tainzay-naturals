import type { IQuoteRequest } from '../../models/QuoteRequest';

function formatCurrency(amount: number): string {
  return `Rs.${Math.round(amount).toLocaleString('en-PK')}`;
}

function buildItemsInline(quote: IQuoteRequest): string {
  return quote.items.map((item) => `${item.productName} x ${item.quantity}`).join(', ');
}

function getOrderTotal(quote: IQuoteRequest): number {
  if (typeof quote.orderTotal === 'number' && quote.orderTotal > 0) {
    return quote.orderTotal;
  }

  const match = quote.message?.match(/Order total:\s*Rs\.([\d,]+)/i);
  if (match?.[1]) {
    return Number(match[1].replace(/,/g, ''));
  }

  return quote.items.reduce((sum, item) => {
    const unitPrice = item.requestedPrice ?? 0;
    return sum + unitPrice * item.quantity;
  }, 0);
}

function getPaymentLabel(quote: IQuoteRequest): string {
  if (quote.paymentMethod === 'cod') return 'Cash on Delivery';
  if (quote.paymentMethod === 'card') return 'Card';
  const match = quote.message?.match(/Payment:\s*(.+)/i);
  return match?.[1]?.trim() ?? 'Not specified';
}

/** Exact customer-facing template for email and WhatsApp */
export function buildOrderReceivedMessage(quote: IQuoteRequest): string {
  const customerName = quote.contactPerson;
  const orderNumber = quote.orderNumber ?? 'Pending';
  const items = buildItemsInline(quote);
  const orderTotal = formatCurrency(getOrderTotal(quote));
  const paymentMethod = getPaymentLabel(quote);

  return `Hi ${customerName},

Thank you for your order with **Tainzay**.

Your order has been successfully received and is now being processed.

**Order Details**
Order #: ${orderNumber}
Items: ${items}
Total: ${orderTotal}
Payment: ${paymentMethod}

We'll notify you once your order has been dispatched, along with the tracking details.

Thank you for choosing **Tainzay**.

Warm regards,
**Tainzay Team**`;
}

export function messageToHtml(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

export function buildOrderReceivedEmail(quote: IQuoteRequest): { subject: string; text: string; html: string } {
  const brandName = process.env.BRAND_NAME ?? 'Tainzay';
  const orderNumber = quote.orderNumber ?? 'Pending';
  const text = buildOrderReceivedMessage(quote);
  const subject = `${brandName} — Order Received (${orderNumber})`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1a1a1a; max-width: 560px; line-height: 1.6;">
      ${messageToHtml(text)}
    </div>
  `;

  return { subject, text, html };
}

function getOrderSourceLabel(quote: IQuoteRequest): string {
  return quote.source === 'checkout' ? 'Checkout order' : 'Quote request';
}

/** Alert sent to the store admin when a new order or quote arrives */
export function buildAdminOrderAlertMessage(quote: IQuoteRequest): string {
  const orderNumber = quote.orderNumber ?? 'Pending';
  const items = buildItemsInline(quote);
  const orderTotal = formatCurrency(getOrderTotal(quote));
  const paymentMethod = getPaymentLabel(quote);
  const sourceLabel = getOrderSourceLabel(quote);

  return `New ${sourceLabel.toLowerCase()} — ${orderNumber}

Customer: ${quote.contactPerson}
Company: ${quote.companyName}
Email: ${quote.email}
Phone: ${quote.phone}
Items: ${items}
Total: ${orderTotal}
Payment: ${paymentMethod}
Status: ${quote.status}

Open the admin panel to review and respond.`;
}

export function buildAdminOrderAlertEmail(quote: IQuoteRequest): {
  subject: string;
  text: string;
  html: string;
} {
  const brandName = process.env.BRAND_NAME ?? 'Tainzay';
  const orderNumber = quote.orderNumber ?? 'Pending';
  const sourceLabel = getOrderSourceLabel(quote);
  const text = buildAdminOrderAlertMessage(quote);
  const subject = `${brandName} — New ${sourceLabel} (${orderNumber})`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1a1a1a; max-width: 560px; line-height: 1.6;">
      <h2 style="margin: 0 0 12px;">New ${sourceLabel}</h2>
      ${messageToHtml(text)}
    </div>
  `;

  return { subject, text, html };
}
