'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Breadcrumb from '@/components/layout/Breadcrumb';
import CartDiscountBanner from '@/components/cart/CartDiscountBanner';
import CartEmptyState from '@/components/cart/CartEmptyState';
import CartItemCard from '@/components/cart/CartItemCard';
import CartSummary from '@/components/cart/CartSummary';
import { useCart } from '@/hooks/useCart';
import { productsApi } from '@/lib/api';
import {
  getDisplayLineSubtotal,
  getProductDisplayPricing,
} from '@/lib/product-pricing';
import type { Product } from '@/types';

export default function CartPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lines, count, hydrated, addItem, setQuantity, removeItem } = useCart();
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loadingProducts, setLoadingProducts] = useState(false);
  const processedAddRef = useRef<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;

    const addSlug = searchParams.get('add');
    const qtyParam = searchParams.get('qty');
    if (!addSlug) return;

    const dedupeKey = `${addSlug}:${qtyParam ?? '1'}`;
    if (processedAddRef.current === dedupeKey) return;
    processedAddRef.current = dedupeKey;

    const quantity = Math.max(1, Number(qtyParam) || 1);
    addItem(addSlug, quantity);
    router.replace('/cart', { scroll: false });
  }, [hydrated, searchParams, addItem, router]);

  useEffect(() => {
    if (!hydrated || lines.length === 0) {
      setProducts({});
      return;
    }

    let cancelled = false;

    async function loadProducts() {
      setLoadingProducts(true);

      try {
        const responses = await Promise.all(
          lines.map(async (line) => {
            try {
              const { data } = await productsApi.getBySlug(line.slug);
              return data;
            } catch {
              return null;
            }
          }),
        );

        if (cancelled) return;

        const next: Record<string, Product> = {};
        responses.forEach((product) => {
          if (product) next[product.slug] = product;
        });
        setProducts(next);
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [hydrated, lines]);

  const totals = useMemo(() => {
    let subtotal = 0;
    let savings = 0;

    for (const line of lines) {
      const product = products[line.slug];
      if (!product) continue;

      const { originalPrice } = getProductDisplayPricing(product);
      const lineTotal = getDisplayLineSubtotal(product, line.quantity);

      subtotal += lineTotal;
      savings += Math.max(0, originalPrice * line.quantity - lineTotal);
    }

    return { subtotal, savings, total: subtotal };
  }, [lines, products]);

  const hasItems = hydrated && lines.length > 0;
  const itemLabel = count === 1 ? '1 item' : `${count} items`;

  return (
    <div className="cart-page">
      <div className="container-wide">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Your Cart' }]} />

        <header className="cart-header">
          <div>
            <h1 className="cart-title">Your Cart</h1>
            <p className="cart-subtitle">
              {hasItems
                ? `${itemLabel} · Review your items and proceed to checkout.`
                : 'Review your items and proceed to checkout.'}
            </p>
          </div>
        </header>

        {!hydrated || (loadingProducts && hasItems) ? (
          <div className="cart-loading" aria-live="polite">
            Loading your cart…
          </div>
        ) : !hasItems ? (
          <CartEmptyState />
        ) : (
          <div className="cart-layout">
            <div className="cart-main">
              <CartDiscountBanner savings={totals.savings} />

              <ul className="cart-items">
                {lines.map((line) => {
                  const product = products[line.slug];
                  if (!product) return null;

                  return (
                    <li key={line.slug}>
                      <CartItemCard
                        product={product}
                        quantity={line.quantity}
                        onQuantityChange={(quantity) => setQuantity(line.slug, quantity)}
                        onRemove={() => removeItem(line.slug)}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>

            <CartSummary
              subtotal={totals.subtotal}
              savings={totals.savings}
              total={totals.total}
              itemCount={count}
            />
          </div>
        )}
      </div>
    </div>
  );
}
