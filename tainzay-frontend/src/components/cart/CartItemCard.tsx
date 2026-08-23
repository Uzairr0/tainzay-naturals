'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import CartQuantityControl from '@/components/cart/CartQuantityControl';
import { imageLoaderFor } from '@/lib/cloudinary';
import { formatPrice } from '@/lib/format';
import { getDisplayLineSubtotal, getProductDisplayPricing } from '@/lib/product-pricing';
import type { Product } from '@/types';

interface CartItemCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export default function CartItemCard({
  product,
  quantity,
  onQuantityChange,
  onRemove,
}: CartItemCardProps) {
  const { originalPrice, onSale } = getProductDisplayPricing(product);
  const lineSubtotal = getDisplayLineSubtotal(product, quantity);
  const lineOriginal = originalPrice * quantity;
  const imageSrc = product.image || '/products/placeholder.svg';
  const disabled = !product.inStock;

  return (
    <article className="cart-item">
      <Link href={`/products/${product.slug}`} className="cart-item-media">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          loader={imageLoaderFor(imageSrc, 'square')}
          className="object-contain p-1"
          sizes="96px"
        />
      </Link>

      <div className="cart-item-body">
        <div className="cart-item-top">
          <Link href={`/products/${product.slug}`} className="cart-item-name">
            {product.name}
          </Link>
          <button
            type="button"
            className="cart-item-remove"
            onClick={onRemove}
            aria-label={`Remove ${product.name} from cart`}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="cart-item-prices">
          {onSale && lineOriginal > lineSubtotal && (
            <span className="cart-item-price-original">{formatPrice(lineOriginal)}</span>
          )}
          <span className={`cart-item-price-current${onSale ? ' is-sale' : ''}`}>
            {formatPrice(lineSubtotal)}
          </span>
        </div>

        {!product.inStock && (
          <p className="cart-item-oos">This product is currently out of stock.</p>
        )}

        <CartQuantityControl
          slug={product.slug}
          value={quantity}
          onChange={onQuantityChange}
          disabled={disabled}
        />
      </div>
    </article>
  );
}
