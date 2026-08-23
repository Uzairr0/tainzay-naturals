import QuoteRequest from '../models/QuoteRequest';

function getDatePrefix(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `TZ-${y}${m}${d}-`;
}

/** Generates a unique daily order number, e.g. TZ-20260220-0001 */
export async function generateOrderNumber(): Promise<string> {
  const prefix = getDatePrefix();
  const latest = await QuoteRequest.findOne({ orderNumber: new RegExp(`^${prefix}`) })
    .sort({ orderNumber: -1 })
    .select('orderNumber')
    .lean();

  const lastSeq = latest?.orderNumber ? parseInt(latest.orderNumber.slice(-4), 10) : 0;
  const nextSeq = Number.isFinite(lastSeq) ? lastSeq + 1 : 1;

  return `${prefix}${String(nextSeq).padStart(4, '0')}`;
}
