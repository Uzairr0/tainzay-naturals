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

export type PaymentMethod = 'cod' | 'card';

export interface CheckoutFormValues {
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  address: string;
  city: string;
  phone: string;
  paymentMethod: PaymentMethod;
}

export const EMPTY_CHECKOUT_FORM: CheckoutFormValues = {
  email: '',
  firstName: '',
  lastName: '',
  companyName: '',
  address: '',
  city: '',
  phone: '',
  paymentMethod: 'cod',
};
