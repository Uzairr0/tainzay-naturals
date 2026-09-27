/** Standard delivery fee when order subtotal is below the free-delivery threshold */
export const CHECKOUT_DELIVERY_FEE = 250;

/** Orders at or above this subtotal (PKR) qualify for free delivery */
export const CHECKOUT_FREE_DELIVERY_MIN = 1800;

export interface CheckoutDeliverySettings {
  freeDeliveryMin: number;
  deliveryFee: number;
}

export const DEFAULT_CHECKOUT_DELIVERY: CheckoutDeliverySettings = {
  freeDeliveryMin: CHECKOUT_FREE_DELIVERY_MIN,
  deliveryFee: CHECKOUT_DELIVERY_FEE,
};

export function getCheckoutDeliveryFee(
  subtotal: number,
  settings: CheckoutDeliverySettings = DEFAULT_CHECKOUT_DELIVERY,
): number {
  return subtotal >= settings.freeDeliveryMin ? 0 : settings.deliveryFee;
}

export function getCheckoutDeliveryLabel(
  subtotal: number,
  settings: CheckoutDeliverySettings = DEFAULT_CHECKOUT_DELIVERY,
): string {
  const fee = getCheckoutDeliveryFee(subtotal, settings);
  return fee === 0 ? 'Free' : `Rs.${fee.toLocaleString('en-PK')}`;
}

export const CHECKOUT_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Sargodha',
  'Bahawalpur',
  'Sukkur',
  'Other',
] as const;

export interface CheckoutFormValues {
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  address: string;
  city: string;
  phone: string;
  /** Id of a payment method from site settings */
  paymentMethod: string;
  /** Transaction ID of the customer's transfer */
  paymentReference: string;
}

export const EMPTY_CHECKOUT_FORM: CheckoutFormValues = {
  email: '',
  firstName: '',
  lastName: '',
  companyName: '',
  address: '',
  city: '',
  phone: '',
  paymentMethod: '',
  paymentReference: '',
};

export interface WhatsAppOrderLine {
  name: string;
  quantity: number;
  lineTotal: number;
}

function formatRs(amount: number): string {
  return `Rs.${Math.round(amount).toLocaleString('en-PK')}`;
}

/** Pre-filled WhatsApp message for customers who'd rather arrange payment in chat */
export function buildWhatsAppOrderMessage(
  lines: WhatsAppOrderLine[],
  totals: { deliveryFee: number; total: number },
  values: Pick<CheckoutFormValues, 'firstName' | 'lastName' | 'city'>,
): string {
  const name = `${values.firstName} ${values.lastName}`.trim();
  const items = lines.map(
    (line) => `• ${line.name} x ${line.quantity} = ${formatRs(line.lineTotal)}`,
  );

  return [
    'Hello Tainzy Naturals, I would like to place this order:',
    '',
    ...items,
    '',
    `Delivery: ${totals.deliveryFee === 0 ? 'Free' : formatRs(totals.deliveryFee)}`,
    `Total: ${formatRs(totals.total)}`,
    ...(name ? ['', `Name: ${name}`] : []),
    ...(values.city ? [`City: ${values.city}`] : []),
    '',
    'Please share how I can complete the payment.',
  ].join('\n');
}
