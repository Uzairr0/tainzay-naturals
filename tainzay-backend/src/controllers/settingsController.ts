import { Request, Response } from 'express';
import { getNotificationStatus } from '../services/notifications';
import { getOrCreateSiteSettings, updateSiteSettings } from '../services/siteSettings';

function serializeSettings(settings: Awaited<ReturnType<typeof getOrCreateSiteSettings>>) {
  return {
    supportEmail: settings.supportEmail,
    phoneDisplay: settings.phoneDisplay,
    phoneTel: settings.phoneTel,
    whatsappPhone: settings.whatsappPhone,
    whatsappMessage: settings.whatsappMessage,
    freeDeliveryMin: settings.freeDeliveryMin,
    deliveryFee: settings.deliveryFee,
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
