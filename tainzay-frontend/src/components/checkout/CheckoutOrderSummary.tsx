'use client';

import Image from 'next/image';
import Link from 'next/link';
import { imageLoaderFor } from '@/lib/cloudinary';
import { getCheckoutDeliveryFee, getCheckoutDeliveryLabel, DEFAULT_CHECKOUT_DELIVERY, type CheckoutDeliverySettings } from '@/lib/checkout';
import { formatPrice } from '@/lib/format';
import { getDisplayLineSubtotal } from '@/lib/product-pricing';
import type { CartLine } from '@/lib/cart';
import type { Product } from '@/types';

interface CheckoutOrderSummaryProps {
  lines: CartLine[];
  products: Record<string, Product>;
  subtotal: number;
  savings: number;
  deliverySettings?: CheckoutDeliverySettings;
}

export default function CheckoutOrderSummary({
  lines,
  products,
  subtotal,
  savings,
  deliverySettings = DEFAULT_CHECKOUT_DELIVERY,
}: CheckoutOrderSummaryProps) {
  const deliveryFee = getCheckoutDeliveryFee(subtotal, deliverySettings);
  const deliveryLabel = getCheckoutDeliveryLabel(subtotal, deliverySettings);
  const total = subtotal + deliveryFee;

  return (
    <aside className="checkout-summary" aria-label="Order summary">
      <h2 className="checkout-summary-title">Order summary</h2>

      <ul className="checkout-summary-items">
        {lines.map((line) => {
          const product = products[line.slug];
          if (!product) return null;

          const lineTotal = getDisplayLineSubtotal(product, line.quantity);
          const imageSrc = product.image || '/products/placeholder.svg';

          return (
            <li key={line.slug} className="checkout-summary-item">
              <Link href={`/products/${product.slug}`} className="checkout-summary-thumb">
                <Image
                  src={imageSrc}
                  alt={product.name}
                  fill
                  loader={imageLoaderFor(imageSrc, 'square')}
                  className="object-contain p-0.5"
                  sizes="56px"
                />
              </Link>
              <div className="checkout-summary-item-copy">
                <Link href={`/products/${product.slug}`} className="checkout-summary-item-name">
                  {product.name}
                </Link>
                <p className="checkout-summary-item-meta">
                  Qty {line.quantity} · {formatPrice(lineTotal)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="checkout-summary-rows">
        <div className="checkout-summary-row">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {savings > 0 && (
          <div className="checkout-summary-row checkout-summary-savings">
            <span>You&apos;re saving</span>
            <span>{formatPrice(savings)}</span>
          </div>
        )}
        <div className="checkout-summary-row">
          <span>Delivery</span>
          <span className={deliveryFee === 0 ? 'checkout-delivery-free' : undefined}>{deliveryLabel}</span>
        </div>
      </div>

      <div className="checkout-summary-divider" aria-hidden="true" />

      <div className="checkout-summary-total">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      <p className="checkout-summary-note">
        <Link href="/cart">Edit cart</Link>
      </p>
    </aside>
  );
}
