'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Breadcrumb from '@/components/layout/Breadcrumb';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import CheckoutOrderSummary from '@/components/checkout/CheckoutOrderSummary';
import { useCart } from '@/hooks/useCart';
import { productsApi, quotesApi } from '@/lib/api';
import { clearCart } from '@/lib/cart';
import { getCheckoutDeliveryFee, EMPTY_CHECKOUT_FORM, type CheckoutDeliverySettings, DEFAULT_CHECKOUT_DELIVERY, type CheckoutFormValues } from '@/lib/checkout';
import { getDisplayLineSubtotal, getProductDisplayPricing } from '@/lib/product-pricing';
import type { Product, QuoteItem } from '@/types';

export default function CheckoutPageContent({
  deliverySettings = DEFAULT_CHECKOUT_DELIVERY,
}: {
  deliverySettings?: CheckoutDeliverySettings;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lines, hydrated, addItem } = useCart();
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [formValues, setFormValues] = useState<CheckoutFormValues>(EMPTY_CHECKOUT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState('');
  const [placedContact, setPlacedContact] = useState({ email: '', phone: '' });
  const processedDirectRef = useRef<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;

    const productSlug = searchParams.get('product');
    const qtyParam = searchParams.get('qty');
    if (!productSlug) return;

    const dedupeKey = `${productSlug}:${qtyParam ?? '1'}`;
    if (processedDirectRef.current === dedupeKey) return;
    processedDirectRef.current = dedupeKey;

    const quantity = Math.max(1, Number(qtyParam) || 1);
    addItem(productSlug, quantity);
    router.replace('/checkout', { scroll: false });
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

    return {
      subtotal,
      savings,
      deliveryFee: getCheckoutDeliveryFee(subtotal, deliverySettings),
      total: subtotal + getCheckoutDeliveryFee(subtotal, deliverySettings),
    };
  }, [lines, products, deliverySettings]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    const contactPerson = `${formValues.firstName.trim()} ${formValues.lastName.trim()}`.trim();
    const companyName = formValues.companyName.trim() || contactPerson;
    const fullAddress = `${formValues.address.trim()}, ${formValues.city}`;

    const items: QuoteItem[] = lines.flatMap((line) => {
      const product = products[line.slug];
      if (!product) return [];

      return [
        {
          product: product._id,
          productName: product.name,
          quantity: line.quantity,
          requestedPrice: getDisplayLineSubtotal(product, line.quantity) / line.quantity,
        },
      ];
    });

    if (items.length === 0) {
      setSubmitError('Your cart items could not be loaded. Please return to the cart and try again.');
      setIsSubmitting(false);
      return;
    }

    try {
      const { data } = await quotesApi.create({
        companyName,
        contactPerson,
        email: formValues.email.trim(),
        phone: formValues.phone.trim(),
        whatsappNumber: formValues.phone.trim(),
        address: fullAddress,
        items,
        source: 'checkout',
        orderTotal: totals.total,
        paymentMethod: formValues.paymentMethod,
        message: [
          'Online checkout order',
          `Payment: ${formValues.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}`,
          `Delivery fee: ${totals.deliveryFee === 0 ? 'Free' : `Rs.${totals.deliveryFee.toLocaleString('en-PK')}`}`,
          `Order total: Rs.${totals.total.toLocaleString('en-PK')}`,
        ].join('\n'),
      });

      clearCart();
      setPlacedOrderNumber(data.orderNumber ?? '');
      setPlacedContact({
        email: formValues.email.trim(),
        phone: formValues.phone.trim(),
      });
      setOrderPlaced(true);
    } catch (error: unknown) {
      const message =
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
          ? error.response.data.message
          : 'Could not place your order. Please try again.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasItems = hydrated && lines.length > 0;
  const isLoading = !hydrated || (loadingProducts && hasItems);

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="container-wide">
          <div className="checkout-success">
            <h1 className="checkout-success-title">Thank you for your order</h1>
            {placedOrderNumber ? (
              <p className="checkout-success-order-number" aria-label="Order number">
                Order #{placedOrderNumber}
              </p>
            ) : null}
            <p className="checkout-success-text">
              We have received your order. Your order details have been sent to{' '}
              {placedContact.email && placedContact.phone ? (
                <>
                  <strong>{placedContact.email}</strong> and WhatsApp on{' '}
                  <strong>{placedContact.phone}</strong>.
                </>
              ) : (
                'your email and WhatsApp.'
              )}
            </p>
            <div className="checkout-success-actions">
              <Link href="/products" className="checkout-submit">
                Continue Shopping
              </Link>
              <Link href="/" className="cart-btn cart-btn-outline">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container-wide">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Cart', href: '/cart' },
            { label: 'Checkout' },
          ]}
        />

        <header className="checkout-header">
          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-subtitle">Complete your details to place your order.</p>
        </header>

        {isLoading ? (
          <div className="checkout-loading" aria-live="polite">
            Loading checkout…
          </div>
        ) : !hasItems ? (
          <div className="checkout-empty">
            <h2>Your cart is empty</h2>
            <p>Add products to your cart before checking out.</p>
            <Link href="/products" className="checkout-submit">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="checkout-layout">
            <CheckoutForm
              values={formValues}
              onChange={setFormValues}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              error={submitError}
              subtotal={totals.subtotal}
              deliverySettings={deliverySettings}
            />
            <CheckoutOrderSummary
              lines={lines}
              products={products}
              subtotal={totals.subtotal}
              savings={totals.savings}
              deliverySettings={deliverySettings}
            />
          </div>
        )}
      </div>
    </div>
  );
}
