'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { imageLoaderFor } from '@/lib/cloudinary';
import { formatPrice } from '@/lib/format';
import { isOfferProduct } from '@/lib/product-offers';
import { getProductPricing } from '@/lib/product-pricing';
import StarRating from '@/components/shared/StarRating';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  /** Override when the card sits in a different column count than the home carousel */
  sizes?: string;
  /** Preload above-the-fold product images */
  priority?: boolean;
  /**
   * Pass false on Featured tabs to force list price even for offer SKUs.
   * Otherwise discount UI appears only when isOfferProduct() is true (15%+ tier).
   */
  showDiscount?: boolean;
  /** Optional ribbon label (e.g. Best Selling, New Arrival) */
  badgeLabel?: string;
}

function getCardPricing(product: Product, showDiscount?: boolean) {
  const canShowDiscount = isOfferProduct(product) && showDiscount !== false;

  if (!canShowDiscount) {
    return {
      originalPrice: product.basePrice,
      salePrice: product.basePrice,
      discountPercentage: 0,
    };
  }

  const { originalPrice, salePrice, discountPercentage } = getProductPricing(product);
  return { originalPrice, salePrice, discountPercentage };
}

export default function ProductCard({
  product,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 28vw',
  priority = false,
  showDiscount,
  badgeLabel,
}: ProductCardProps) {
  const { originalPrice, salePrice, discountPercentage } = getCardPricing(
    product,
    showDiscount,
  );
  const rating = product.rating ?? 4.5;
  const showDiscountBadge = discountPercentage > 0;
  const showSectionBadge = !showDiscountBadge && Boolean(badgeLabel);
  const href = `/products/${product.slug}`;
  const [imageSrc, setImageSrc] = useState(product.image || '/products/placeholder.svg');

  return (
    <article className="product-card group">
      <Link href={href} className="product-card-media">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          priority={priority}
          loader={imageLoaderFor(imageSrc, 'square', product.imageFit)}
          className="product-card-image transition-transform duration-300 group-hover:scale-[1.05] motion-safe"
          sizes={sizes}
          onError={() => setImageSrc('/products/placeholder.svg')}
        />

        {showDiscountBadge && (
          <span className="product-card-badge">{discountPercentage}% OFF</span>
        )}

        {showSectionBadge && (
          <span className="product-card-badge">{badgeLabel}</span>
        )}

        {!product.inStock && (
          <span className="product-card-oos">
            <span>Out of Stock</span>
          </span>
        )}
      </Link>

      <div className="product-card-body">
        <Link href={href}>
          <h3 className="product-card-title">{product.name}</h3>
        </Link>

        <StarRating
          rating={rating}
          reviewCount={product.reviewCount}
          className="product-card-rating"
        />

        {product.packSize && (
          <p className="product-card-meta">{product.packSize}</p>
        )}

        <div className="product-card-prices">
          {originalPrice > salePrice && (
            <span className="price-original">{formatPrice(originalPrice)}</span>
          )}
          <span className="price-sale">{formatPrice(salePrice)}</span>
        </div>

      </div>
    </article>
  );
}
