import type { Metadata } from 'next';
import { Suspense } from 'react';
import CartPageContent from '@/components/cart/CartPageContent';

import { CART_METADATA } from '@/lib/site-seo';

export const metadata: Metadata = CART_METADATA;

function CartFallback() {
  return (
    <div className="cart-page">
      <div className="container-wide">
        <div className="cart-loading">Loading your cart…</div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<CartFallback />}>
      <CartPageContent />
    </Suspense>
  );
}
