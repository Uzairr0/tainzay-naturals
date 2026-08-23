import mongoose, { Document, Schema } from 'mongoose';

export interface ISiteSettings extends Document {
  supportEmail: string;
  phoneDisplay: string;
  phoneTel: string;
  whatsappPhone: string;
  whatsappMessage: string;
  freeDeliveryMin: number;
  deliveryFee: number;
  notifyEmailOnOrder: boolean;
  notifyWhatsAppOnOrder: boolean;
  notifyAdminOnReview: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_SITE_SETTINGS = {
  supportEmail: 'guzair421@gmail.com',
  phoneDisplay: '+92 318 4263597',
  phoneTel: '+923184263597',
  whatsappPhone: '923184263597',
  whatsappMessage: 'Hello, I am interested in Tainzy Naturals wellness products.',
  freeDeliveryMin: 1800,
  deliveryFee: 250,
  notifyEmailOnOrder: true,
  notifyWhatsAppOnOrder: true,
  notifyAdminOnReview: false,
};

const SiteSettingsSchema: Schema = new Schema(
  {
    supportEmail: { type: String, required: true, trim: true, lowercase: true },
    phoneDisplay: { type: String, required: true, trim: true },
    phoneTel: { type: String, required: true, trim: true },
    whatsappPhone: { type: String, required: true, trim: true },
    whatsappMessage: { type: String, required: true, trim: true },
    freeDeliveryMin: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, min: 0 },
    notifyEmailOnOrder: { type: Boolean, default: true },
    notifyWhatsAppOnOrder: { type: Boolean, default: true },
    notifyAdminOnReview: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
