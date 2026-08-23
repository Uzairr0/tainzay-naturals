import type { Product } from '@/types';

/** Minimum wholesale discount for the Latest Offers & Discounts carousel */
export const OFFER_DISCOUNT_THRESHOLD = 15;

export function getProductDiscountPercentage(product: Product): number {
  const tiers = product.wholesaleTiers ?? [];
  if (tiers.length === 0) return 0;

  return Math.max(
    ...tiers.map((tier) =>
      tier.discountPercentage ??
      (product.basePrice > tier.price
        ? Math.round(((product.basePrice - tier.price) / product.basePrice) * 100)
        : 0),
    ),
  );
}

export function isOfferProduct(product: Product): boolean {
  return getProductDiscountPercentage(product) >= OFFER_DISCOUNT_THRESHOLD;
}

export function getOfferProducts(products: Product[]): Product[] {
  return products.filter(isOfferProduct);
}

export function excludeOfferProducts(products: Product[]): Product[] {
  return products.filter((product) => !isOfferProduct(product));
}
