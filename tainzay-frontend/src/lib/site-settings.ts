import { cache } from 'react';
import {
  CHECKOUT_DELIVERY_FEE,
  CHECKOUT_FREE_DELIVERY_MIN,
  DEFAULT_CHECKOUT_DELIVERY,
  type CheckoutDeliverySettings,
} from '@/lib/checkout';
import type { Fetched } from '@/lib/catalogue';
import { fetchServerJsonCached, REVALIDATE } from '@/lib/server-api';
import type { AdminSettingsResponse, PublicSiteSettings } from '@/types';
import { adminApi } from '@/lib/api';

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

const DEFAULT_PUBLIC_SETTINGS: PublicSiteSettings = {
  supportEmail: 'guzair421@gmail.com',
  phoneDisplay: '+92 304 1217777',
  phoneTel: '+923041217777',
  whatsappPhone: '923041217777',
  whatsappMessage: 'Hello, I am interested in Tainzay Naturals wellness products.',
  freeDeliveryMin: CHECKOUT_FREE_DELIVERY_MIN,
  deliveryFee: CHECKOUT_DELIVERY_FEE,
  // Without the API there are no account details to show; checkout falls back to WhatsApp.
  paymentMethods: [],
};

export function toCheckoutDeliverySettings(
  settings: PublicSiteSettings,
): CheckoutDeliverySettings {
  return {
    freeDeliveryMin: settings.freeDeliveryMin,
    deliveryFee: settings.deliveryFee,
  };
}

export const fetchPublicSiteSettings = cache(async (): Promise<Fetched<PublicSiteSettings>> => {
  try {
    const data = await fetchServerJsonCached<PublicSiteSettings>(
      '/settings',
      REVALIDATE.settings,
    );
    return { data, error: null };
  } catch (error) {
    console.error('Failed to fetch public site settings:', describeError(error));
    return { data: DEFAULT_PUBLIC_SETTINGS, error: describeError(error) };
  }
});

export async function fetchAdminSettings(): Promise<Fetched<AdminSettingsResponse>> {
  try {
    const response = await adminApi.getSettings();
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Failed to fetch admin settings:', describeError(error));
    return {
      data: {
        settings: {
          ...DEFAULT_PUBLIC_SETTINGS,
          notifyEmailOnOrder: true,
          notifyWhatsAppOnOrder: true,
          notifyAdminOnReview: false,
        },
        notifications: {
          email: { configured: false, provider: 'unknown' },
          whatsapp: { configured: false, provider: 'unknown' },
        },
      },
      error: describeError(error),
    };
  }
}

export { DEFAULT_CHECKOUT_DELIVERY, DEFAULT_PUBLIC_SETTINGS };
