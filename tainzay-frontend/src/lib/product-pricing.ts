import type { Product } from '@/types';
import { isOfferProduct } from '@/lib/product-offers';

export interface ProductPricing {
  originalPrice: number;
  salePrice: number;
  discountPercentage: number;
  onSale: boolean;
}

export interface WholesaleTierRow {
  minQuantity: number;
  price: number;
  discountPercentage: number;
}

/** All wholesale tiers sorted by minimum quantity */
export function getWholesaleTierRows(product: Product): WholesaleTierRow[] {
  const base = product.basePrice;

  return [...(product.wholesaleTiers ?? [])]
    .map((tier) => ({
      minQuantity: tier.minQuantity,
      price: tier.price,
      discountPercentage:
        tier.discountPercentage ??
        (base > tier.price ? Math.round(((base - tier.price) / base) * 100) : 0),
    }))
    .sort((a, b) => a.minQuantity - b.minQuantity);
}

/** Unit price for a given quantity, honouring the best matching wholesale tier */
export function getUnitPriceForQuantity(product: Product, quantity: number): number {
  const { salePrice } = getProductPricing(product);
  const tiers = getWholesaleTierRows(product);

  const bestTier = tiers
    .filter((tier) => quantity >= tier.minQuantity)
    .sort((a, b) => b.minQuantity - a.minQuantity)[0];

  return bestTier?.price ?? salePrice;
}

export function getLineSubtotal(product: Product, quantity: number): number {
  return getUnitPriceForQuantity(product, quantity) * quantity;
}

/** Shared pricing logic for cards and the product detail page */
export function getProductPricing(product: Product): ProductPricing {
  const tier = product.wholesaleTiers?.[0];
  const originalPrice = product.basePrice;
  const salePrice = tier?.price ?? product.basePrice;
  const discountPercentage =
    tier?.discountPercentage ??
    (originalPrice > salePrice
      ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
      : 0);

  return {
    originalPrice,
    salePrice,
    discountPercentage,
    onSale: discountPercentage > 0 || salePrice < originalPrice,
  };
}

/** Storefront pricing — discounts only for Latest Offers products (15%+ tier). */
export function getProductDisplayPricing(product: Product): ProductPricing {
  if (!isOfferProduct(product)) {
    return {
      originalPrice: product.basePrice,
      salePrice: product.basePrice,
      discountPercentage: 0,
      onSale: false,
    };
  }

  return getProductPricing(product);
}

/** Line subtotal shown on the product page and purchase bar. */
export function getDisplayLineSubtotal(product: Product, quantity: number): number {
  if (!isOfferProduct(product)) {
    return product.basePrice * quantity;
  }

  return getLineSubtotal(product, quantity);
}
