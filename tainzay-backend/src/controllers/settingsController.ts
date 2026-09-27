import { Request, Response } from 'express';
import { getNotificationStatus } from '../services/notifications';
import { getOrCreateSiteSettings, updateSiteSettings } from '../services/siteSettings';
import type { IPaymentMethod } from '../models/SiteSettings';

function serializePaymentMethods(methods: IPaymentMethod[]) {
  return methods.map(({ id, name, details, enabled }) => ({ id, name, details, enabled }));
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/** Validates the admin's list; returns undefined when the payload is not a usable list. */
function parsePaymentMethods(value: unknown): IPaymentMethod[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const seen = new Set<string>();
  const methods: IPaymentMethod[] = [];

  for (const item of value) {
    if (!item || typeof item !== 'object') return undefined;
    const { id, name, details, enabled } = item as Record<string, unknown>;
    if (typeof name !== 'string' || !name.trim()) return undefined;

    let key = slugify(typeof id === 'string' && id.trim() ? id : name) || 'method';
    while (seen.has(key)) key = `${key}-2`;
    seen.add(key);

    methods.push({
      id: key,
      name: name.trim(),
      details: typeof details === 'string' ? details.trim() : '',
      enabled: enabled !== false,
    });
  }

  return methods;
}

function serializeSettings(settings: Awaited<ReturnType<typeof getOrCreateSiteSettings>>) {
  return {
    supportEmail: settings.supportEmail,
    phoneDisplay: settings.phoneDisplay,
    phoneTel: settings.phoneTel,
    whatsappPhone: settings.whatsappPhone,
    whatsappMessage: settings.whatsappMessage,
    freeDeliveryMin: settings.freeDeliveryMin,
    deliveryFee: settings.deliveryFee,
    paymentMethods: serializePaymentMethods(settings.paymentMethods),
    notifyEmailOnOrder: settings.notifyEmailOnOrder,
    notifyWhatsAppOnOrder: settings.notifyWhatsAppOnOrder,
    notifyAdminOnReview: settings.notifyAdminOnReview,
    updatedAt: settings.updatedAt,
  };
}

export const getPublicSettings = async (_req: Request, res: Response) => {
  try {
    const settings = await getOrCreateSiteSettings();
    res.json({
      supportEmail: settings.supportEmail,
      phoneDisplay: settings.phoneDisplay,
      phoneTel: settings.phoneTel,
      whatsappPhone: settings.whatsappPhone,
      whatsappMessage: settings.whatsappMessage,
      freeDeliveryMin: settings.freeDeliveryMin,
      deliveryFee: settings.deliveryFee,
      paymentMethods: serializePaymentMethods(
        settings.paymentMethods.filter((method) => method.enabled),
      ),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to load settings';
    res.status(500).json({ message });
  }
};

export const getAdminSettings = async (_req: Request, res: Response) => {
  try {
    const settings = await getOrCreateSiteSettings();
    res.json({
      settings: serializeSettings(settings),
      notifications: getNotificationStatus(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to load settings';
    res.status(500).json({ message });
  }
};

export const patchAdminSettings = async (req: Request, res: Response) => {
  try {
    const {
      supportEmail,
      phoneDisplay,
      phoneTel,
      whatsappPhone,
      whatsappMessage,
      freeDeliveryMin,
      deliveryFee,
      paymentMethods,
      notifyEmailOnOrder,
      notifyWhatsAppOnOrder,
      notifyAdminOnReview,
    } = req.body;

    const updates: Record<string, unknown> = {};

    if (typeof supportEmail === 'string' && supportEmail.trim()) {
      updates.supportEmail = supportEmail.trim().toLowerCase();
    }
    if (typeof phoneDisplay === 'string' && phoneDisplay.trim()) {
      updates.phoneDisplay = phoneDisplay.trim();
    }
    if (typeof phoneTel === 'string' && phoneTel.trim()) {
      updates.phoneTel = phoneTel.trim();
    }
    if (typeof whatsappPhone === 'string' && whatsappPhone.trim()) {
      updates.whatsappPhone = whatsappPhone.trim();
    }
    if (typeof whatsappMessage === 'string' && whatsappMessage.trim()) {
      updates.whatsappMessage = whatsappMessage.trim();
    }
    if (Number.isFinite(Number(freeDeliveryMin)) && Number(freeDeliveryMin) >= 0) {
      updates.freeDeliveryMin = Number(freeDeliveryMin);
    }
    if (Number.isFinite(Number(deliveryFee)) && Number(deliveryFee) >= 0) {
      updates.deliveryFee = Number(deliveryFee);
    }
    if (paymentMethods !== undefined) {
      const parsed = parsePaymentMethods(paymentMethods);
      if (!parsed) {
        return res.status(400).json({ message: 'Each payment method needs a name.' });
      }
      updates.paymentMethods = parsed;
    }
    if (typeof notifyEmailOnOrder === 'boolean') {
      updates.notifyEmailOnOrder = notifyEmailOnOrder;
    }
    if (typeof notifyWhatsAppOnOrder === 'boolean') {
      updates.notifyWhatsAppOnOrder = notifyWhatsAppOnOrder;
    }
    if (typeof notifyAdminOnReview === 'boolean') {
      updates.notifyAdminOnReview = notifyAdminOnReview;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid settings to update' });
    }

    const settings = await updateSiteSettings(updates);
    res.json({
      settings: serializeSettings(settings),
      notifications: getNotificationStatus(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update settings';
    res.status(400).json({ message });
  }
};
