import { getWhatsAppUrl, SITE } from '@/lib/site-config';
import type { Product } from '@/types';

export function buildProductWhatsAppMessage(product: Product, quantity: number): string {
  return [
    'Hello, I would like a quote for:',
    '',
    product.name,
    `Quantity: ${quantity}`,
    product.sku ? `SKU: ${product.sku}` : '',
    '',
    'Please share pricing and availability.',
  ]
    .filter(Boolean)
    .join('\n');
}

export function getProductWhatsAppUrl(product: Product, quantity: number): string {
  return getWhatsAppUrl(SITE.whatsappPhone, buildProductWhatsAppMessage(product, quantity));
}

export function getProductQuoteHref(product: Product, quantity: number): string {
  const params = new URLSearchParams({
    product: product._id,
    slug: product.slug,
    name: product.name,
    qty: String(quantity),
  });

  return `/contact?${params.toString()}`;
}
