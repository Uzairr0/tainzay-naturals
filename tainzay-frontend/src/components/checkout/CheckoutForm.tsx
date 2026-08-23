'use client';

import {
  CHECKOUT_CITIES,
  getCheckoutDeliveryFee,
  getCheckoutDeliveryLabel,
  DEFAULT_CHECKOUT_DELIVERY,
  type CheckoutDeliverySettings,
  type CheckoutFormValues,
} from '@/lib/checkout';

interface CheckoutFormProps {
  values: CheckoutFormValues;
  onChange: (values: CheckoutFormValues) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  error?: string;
  subtotal: number;
  deliverySettings?: CheckoutDeliverySettings;
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
}: CheckoutFormProps) {
  const deliveryFee = getCheckoutDeliveryFee(subtotal, deliverySettings);
  const deliveryLabel = getCheckoutDeliveryLabel(subtotal, deliverySettings);

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

        <div className="checkout-payment-options">
          <label className={`checkout-payment-option${values.paymentMethod === 'cod' ? ' is-selected' : ''}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={values.paymentMethod === 'cod'}
              onChange={() => updateField(values, onChange, 'paymentMethod', 'cod')}
            />
            <span className="checkout-payment-copy">
              <span className="checkout-payment-label">Cash on Delivery</span>
              <span className="checkout-payment-hint">Pay when your order arrives</span>
            </span>
          </label>

          <label className="checkout-payment-option is-disabled">
            <input type="radio" name="paymentMethod" value="card" disabled />
            <span className="checkout-payment-copy">
              <span className="checkout-payment-label">Card</span>
              <span className="checkout-payment-hint">Coming soon</span>
            </span>
          </label>
        </div>
      </section>

      {error && (
        <p className="checkout-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="checkout-submit" disabled={isSubmitting}>
        {isSubmitting ? 'Placing order…' : 'Place Order'}
      </button>
    </form>
  );
}
