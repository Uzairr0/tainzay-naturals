import type { Metadata } from 'next';
import { Suspense } from 'react';
import CheckoutPageContent from '@/components/checkout/CheckoutPageContent';
import { fetchPublicSiteSettings, toCheckoutDeliverySettings } from '@/lib/site-settings';

import { CHECKOUT_METADATA } from '@/lib/site-seo';

export const metadata: Metadata = CHECKOUT_METADATA;

function CheckoutFallback() {
  return (
    <div className="checkout-page">
      <div className="container-wide">
        <div className="checkout-loading">Loading checkout…</div>
      </div>
    </div>
  );
}

export default async function CheckoutPage() {
  const { data: settings } = await fetchPublicSiteSettings();
  const deliverySettings = toCheckoutDeliverySettings(settings);

  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutPageContent deliverySettings={deliverySettings} />
    </Suspense>
  );
}
