import Link from 'next/link';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { formatPrice } from '@/lib/format';
import { getWhatsAppUrl } from '@/lib/site-config';

interface CartSummaryProps {
  subtotal: number;
  savings: number;
  total: number;
  itemCount: number;
}

export default function CartSummary({ subtotal, savings, total, itemCount }: CartSummaryProps) {
  const bulkQuoteUrl = getWhatsAppUrl(undefined, 'Hello, I would like a custom quote for a bulk order.');

  return (
    <aside className="cart-summary" aria-label="Order summary">
      <h2 className="cart-summary-title">Order summary</h2>

      <div className="cart-summary-rows">
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="cart-summary-row cart-summary-savings">
          <span>You&apos;re saving</span>
          <span>{formatPrice(savings)}</span>
        </div>
      </div>

      <div className="cart-summary-divider" aria-hidden="true" />

      <div className="cart-summary-total">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      <div className="cart-summary-actions">
        <Link
          href="/checkout"
          className={`cart-summary-btn cart-summary-btn-checkout${itemCount === 0 ? ' is-disabled' : ''}`}
          aria-disabled={itemCount === 0}
          tabIndex={itemCount === 0 ? -1 : undefined}
          onClick={itemCount === 0 ? (event) => event.preventDefault() : undefined}
        >
          Checkout
        </Link>
        <Link href="/products" className="cart-summary-btn cart-summary-btn-shop">
          Shop more
        </Link>
      </div>

      <div className="cart-summary-divider" aria-hidden="true" />

      <a
        href={bulkQuoteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="cart-summary-bulk"
      >
        <WhatsAppIcon className="cart-summary-bulk-icon" />
        <span>Bulk order? message us for a custom quote</span>
      </a>
    </aside>
  );
}
