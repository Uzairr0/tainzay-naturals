'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type RefObject } from 'react';
import QuantitySelector from '@/components/products/QuantitySelector';
import ProductTrustBadges from '@/components/products/ProductTrustBadges';
import { imageLoaderFor } from '@/lib/cloudinary';
import { formatPrice } from '@/lib/format';
import {
  getDisplayLineSubtotal,
  getProductDisplayPricing,
} from '@/lib/product-pricing';
import type { Product } from '@/types';

function buildCartHref(product: Product, quantity: number): string {
  const params = new URLSearchParams({
    add: product.slug,
    qty: String(quantity),
  });
  return `/cart?${params.toString()}`;
}

function buildCheckoutHref(product: Product, quantity: number): string {
  const params = new URLSearchParams({
    product: product.slug,
    qty: String(quantity),
  });
  return `/checkout?${params.toString()}`;
}

interface ProductPurchaseActionsProps {
  product: Product;
  quantity: number;
  onQuantityChange: (value: number) => void;
  actionsRef?: RefObject<HTMLDivElement | null>;
}

function ProductPurchaseActions({
  product,
  quantity,
  onQuantityChange,
  actionsRef,
}: ProductPurchaseActionsProps) {
  const disabled = !product.inStock;
  const subtotal = getDisplayLineSubtotal(product, quantity);
  const cartHref = buildCartHref(product, quantity);
  const checkoutHref = buildCheckoutHref(product, quantity);

  return (
    <section className="pdp-purchase" aria-label="Purchase options">
      <QuantitySelector
        value={quantity}
        onChange={onQuantityChange}
        disabled={disabled}
      />

      <p className="pdp-subtotal" aria-live="polite">
        Subtotal: <span>{formatPrice(subtotal)}</span>
      </p>

      <div ref={actionsRef} className="pdp-actions">
        <Link
          href={cartHref}
          className={`pdp-btn pdp-btn-primary${disabled ? ' is-disabled' : ''}`}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          onClick={disabled ? (event) => event.preventDefault() : undefined}
        >
          Add to Cart
        </Link>

        <Link
          href={checkoutHref}
          className={`pdp-btn pdp-btn-outline${disabled ? ' is-disabled' : ''}`}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          onClick={disabled ? (event) => event.preventDefault() : undefined}
        >
          Checkout
        </Link>
      </div>

      <ProductTrustBadges />
    </section>
  );
}

interface ProductStickyBarProps {
  product: Product;
  quantity: number;
  onQuantityChange: (value: number) => void;
}

function ProductStickyBar({ product, quantity, onQuantityChange }: ProductStickyBarProps) {
  const { onSale, originalPrice } = getProductDisplayPricing(product);
  const disabled = !product.inStock;
  const subtotal = getDisplayLineSubtotal(product, quantity);
  const cartHref = buildCartHref(product, quantity);
  const imageSrc = product.image || '/products/placeholder.svg';
  const unitPrice = subtotal / quantity;

  return (
    <aside className="pdp-sticky-bar" aria-label="Quick purchase bar">
      <div className="pdp-sticky-bar-inner container-wide">
        <div className="pdp-sticky-product">
          <div className="pdp-sticky-thumb">
            <Image
              src={imageSrc}
              alt=""
              fill
              loader={imageLoaderFor(imageSrc, 'square')}
              className="object-contain p-1"
              sizes="48px"
            />
          </div>
          <div className="pdp-sticky-copy">
            <p className="pdp-sticky-title">{product.name}</p>
            <p className="pdp-sticky-price">
              {onSale && originalPrice > unitPrice && (
                <span className="pdp-sticky-price-original">{formatPrice(originalPrice * quantity)}</span>
              )}
              <span className={onSale ? 'pdp-sticky-price-sale' : ''}>{formatPrice(subtotal)}</span>
            </p>
          </div>
        </div>

        <div className="pdp-sticky-controls">
          <QuantitySelector
            value={quantity}
            onChange={onQuantityChange}
            disabled={disabled}
            id="product-quantity-sticky"
            label="Qty"
          />

          <Link
            href={cartHref}
            className={`pdp-sticky-btn${disabled ? ' is-disabled' : ''}`}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : undefined}
            onClick={disabled ? (event) => event.preventDefault() : undefined}
          >
            Add to Cart
          </Link>
        </div>
      </div>
    </aside>
  );
}

interface ProductPurchaseExperienceProps {
  product: Product;
}

export default function ProductPurchaseExperience({ product }: ProductPurchaseExperienceProps) {
  const [quantity, setQuantity] = useState(1);
  const actionsRef = useRef<HTMLDivElement>(null);
  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    const node = actionsRef.current;
    if (!node) return;

    const mediaQuery = window.matchMedia('(max-width: 1023px)');

    const updateSticky = (entry: IntersectionObserverEntry) => {
      setStickyVisible(mediaQuery.matches && !entry.isIntersecting);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) updateSticky(entry);
      },
      { threshold: 0, rootMargin: '0px' },
    );

    observer.observe(node);

    const handleViewportChange = () => {
      if (!mediaQuery.matches) {
        setStickyVisible(false);
      }
    };

    mediaQuery.addEventListener('change', handleViewportChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleViewportChange);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('pdp-sticky-active', stickyVisible);
    return () => {
      document.body.classList.remove('pdp-sticky-active');
    };
  }, [stickyVisible]);

  return (
    <>
      <ProductPurchaseActions
        product={product}
        quantity={quantity}
        onQuantityChange={setQuantity}
        actionsRef={actionsRef}
      />
      {stickyVisible && (
        <ProductStickyBar
          product={product}
          quantity={quantity}
          onQuantityChange={setQuantity}
        />
      )}
    </>
  );
}
