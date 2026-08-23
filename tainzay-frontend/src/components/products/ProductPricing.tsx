import { formatPrice } from '@/lib/format';
import { getProductDisplayPricing } from '@/lib/product-pricing';
import type { Product } from '@/types';

interface ProductPricingProps {
  product: Product;
}

export default function ProductPricing({ product }: ProductPricingProps) {
  const { originalPrice, salePrice, discountPercentage, onSale } =
    getProductDisplayPricing(product);

  return (
    <section className="pdp-pricing" aria-label="Product pricing">
      <div className="pdp-price-row">
        {onSale && (
          <span className="pdp-price-original">{formatPrice(originalPrice)}</span>
        )}
        <span className={`pdp-price-current${onSale ? ' is-sale' : ''}`}>
          {formatPrice(salePrice)}
        </span>
        {onSale && discountPercentage > 0 && (
          <span className="pdp-price-save">Save {discountPercentage}%</span>
        )}
      </div>

      <p className="pdp-price-note">Price per unit · Excludes taxes &amp; shipping</p>

      {onSale && (
        <p className="pdp-promo">
          Online Limited Time Offer For Wholesale Customers
          {discountPercentage > 0 && (
            <span className="pdp-promo-badge">{discountPercentage}% OFF</span>
          )}
        </p>
      )}
    </section>
  );
}
