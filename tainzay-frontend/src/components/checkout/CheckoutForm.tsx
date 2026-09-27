'use client';

import {
  CHECKOUT_CITIES,
  getCheckoutDeliveryFee,
  getCheckoutDeliveryLabel,
  DEFAULT_CHECKOUT_DELIVERY,
  type CheckoutDeliverySettings,
  type CheckoutFormValues,
} from '@/lib/checkout';
import { formatPrice } from '@/lib/format';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import type { PaymentMethodOption } from '@/types';

interface CheckoutFormProps {
  values: CheckoutFormValues;
  onChange: (values: CheckoutFormValues) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  error?: string;
  subtotal: number;
  deliverySettings?: CheckoutDeliverySettings;
  paymentMethods: PaymentMethodOption[];
  orderTotal: number;
  whatsappOrderUrl: string;
}

function updateField<K extends keyof CheckoutFormValues>(
  values: CheckoutFormValues,
  onChange: CheckoutFormProps['onChange'],
  field: K,
  value: CheckoutFormValues[K],
) {
  onChange({ ...values, [field]: value });
}

export default function CheckoutForm({
  values,
  onChange,
  onSubmit,
  isSubmitting,
  error,
  subtotal,
  deliverySettings = DEFAULT_CHECKOUT_DELIVERY,
  paymentMethods,
  orderTotal,
  whatsappOrderUrl,
}: CheckoutFormProps) {
  const deliveryFee = getCheckoutDeliveryFee(subtotal, deliverySettings);
  const deliveryLabel = getCheckoutDeliveryLabel(subtotal, deliverySettings);
  const hasPaymentMethods = paymentMethods.length > 0;
  const selectedMethod = paymentMethods.find((method) => method.id === values.paymentMethod);

  return (
    <form className="checkout-form" onSubmit={onSubmit} noValidate>
      <section className="checkout-section" aria-labelledby="checkout-contact-heading">
        <h2 id="checkout-contact-heading" className="checkout-section-title">
          Contact &amp; shipping
        </h2>

        <div className="checkout-fields">
          <div className="checkout-field checkout-field-full">
            <label htmlFor="checkout-email">Email</label>
            <input
              id="checkout-email"
              type="email"
              required
              autoComplete="email"
              value={values.email}
              onChange={(event) => updateField(values, onChange, 'email', event.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="checkout-field">
            <label htmlFor="checkout-first-name">First name</label>
            <input
              id="checkout-first-name"
              type="text"
              required
              autoComplete="given-name"
              value={values.firstName}
              onChange={(event) => updateField(values, onChange, 'firstName', event.target.value)}
            />
          </div>

          <div className="checkout-field">
            <label htmlFor="checkout-last-name">Last name</label>
            <input
              id="checkout-last-name"
              type="text"
              required
              autoComplete="family-name"
              value={values.lastName}
              onChange={(event) => updateField(values, onChange, 'lastName', event.target.value)}
            />
          </div>

          <div className="checkout-field checkout-field-full">
            <label htmlFor="checkout-company">Company / Pharmacy name (optional)</label>
            <input
              id="checkout-company"
              type="text"
              autoComplete="organization"
              value={values.companyName}
              onChange={(event) => updateField(values, onChange, 'companyName', event.target.value)}
              placeholder="Your business name"
            />
          </div>

          <div className="checkout-field checkout-field-full">
            <label htmlFor="checkout-address">Address</label>
            <input
              id="checkout-address"
              type="text"
              required
              autoComplete="street-address"
              value={values.address}
              onChange={(event) => updateField(values, onChange, 'address', event.target.value)}
              placeholder="Street address, area, landmark"
            />
          </div>

          <div className="checkout-field">
            <label htmlFor="checkout-city">City</label>
            <select
              id="checkout-city"
              required
              value={values.city}
              onChange={(event) => updateField(values, onChange, 'city', event.target.value)}
            >
              <option value="" disabled>
                Select city
              </option>
              {CHECKOUT_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="checkout-field">
            <label htmlFor="checkout-phone">Phone</label>
            <input
              id="checkout-phone"
              type="tel"
              required
              autoComplete="tel"
              value={values.phone}
              onChange={(event) => updateField(values, onChange, 'phone', event.target.value)}
              placeholder="+92 300 1234567"
            />
          </div>
        </div>
      </section>

      <section className="checkout-section" aria-labelledby="checkout-delivery-heading">
        <h2 id="checkout-delivery-heading" className="checkout-section-title">
          Delivery
        </h2>
        <div className="checkout-delivery-option is-selected">
          <span>Standard delivery</span>
          <span className={deliveryFee === 0 ? 'checkout-delivery-free' : undefined}>{deliveryLabel}</span>
        </div>
        {deliveryFee === 0 ? (
          <p className="checkout-delivery-note">Your order qualifies for free delivery.</p>
        ) : null}
      </section>

      <section className="checkout-section" aria-labelledby="checkout-payment-heading">
        <h2 id="checkout-payment-heading" className="checkout-section-title">
          Payment
        </h2>

        <p className="checkout-payment-required">
          Payment is required before your order can be processed.
        </p>

        {hasPaymentMethods ? (
          <>
            <div className="checkout-payment-options" role="radiogroup" aria-label="Payment method">
              {paymentMethods.map((method) => {
                const isSelected = values.paymentMethod === method.id;

                return (
                  <label
                    key={method.id}
                    className={`checkout-payment-option${isSelected ? ' is-selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={isSelected}
                      onChange={() => updateField(values, onChange, 'paymentMethod', method.id)}
                    />
                    <span className="checkout-payment-copy">
                      <span className="checkout-payment-label">{method.name}</span>
                    </span>
                  </label>
                );
              })}
            </div>

            {selectedMethod && (
              <div className="checkout-payment-details" aria-live="polite">
                <p className="checkout-payment-details-title">
                  Send <strong>{formatPrice(orderTotal)}</strong> to:
                </p>
                <p className="checkout-payment-details-text">{selectedMethod.details}</p>
              </div>
            )}

            <div className="checkout-field checkout-field-full checkout-payment-reference">
              <label htmlFor="checkout-payment-reference">Transaction ID</label>
              <input
                id="checkout-payment-reference"
                type="text"
                required
                maxLength={100}
                autoComplete="off"
                value={values.paymentReference}
                onChange={(event) =>
                  updateField(values, onChange, 'paymentReference', event.target.value)
                }
                placeholder="e.g. TID or reference number from your receipt"
              />
              <span className="checkout-field-hint">
                After paying, enter the transaction ID from your bank or wallet receipt so we
                can match your payment.
              </span>
            </div>
          </>
        ) : (
          <p className="checkout-payment-hint">
            Online payment isn&apos;t available right now. Please send your order to us on
            WhatsApp below.
          </p>
        )}
      </section>

      {error && (
        <p className="checkout-error" role="alert">
          {error}
        </p>
      )}

      {hasPaymentMethods && (
        <button type="submit" className="checkout-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Placing order…' : 'Place Order'}
        </button>
      )}

      <div className="checkout-whatsapp-alt">
        <p className="checkout-whatsapp-alt-text">
          Prefer to arrange payment with us directly? Send your order on WhatsApp and our team
          will help you complete it.
        </p>
        <a
          href={whatsappOrderUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="checkout-whatsapp-btn"
        >
          <WhatsAppIcon className="checkout-whatsapp-btn-icon" />
          Order on WhatsApp
        </a>
      </div>
    </form>
  );
}
