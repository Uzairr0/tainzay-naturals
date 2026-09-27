import SiteSettings, {
  DEFAULT_SITE_SETTINGS,
  type IPaymentMethod,
  type ISiteSettings,
} from '../models/SiteSettings';

export async function getOrCreateSiteSettings(): Promise<ISiteSettings> {
  const existing = await SiteSettings.findOne();
  if (existing) return existing;
  return SiteSettings.create(DEFAULT_SITE_SETTINGS);
}

export type SiteSettingsUpdate = Partial<{
  supportEmail: string;
  phoneDisplay: string;
  phoneTel: string;
  whatsappPhone: string;
  whatsappMessage: string;
  freeDeliveryMin: number;
  deliveryFee: number;
  paymentMethods: IPaymentMethod[];
  notifyEmailOnOrder: boolean;
  notifyWhatsAppOnOrder: boolean;
  notifyAdminOnReview: boolean;
}>;

export async function updateSiteSettings(updates: SiteSettingsUpdate): Promise<ISiteSettings> {
  const settings = await getOrCreateSiteSettings();
  Object.assign(settings, updates);
  return settings.save();
}
