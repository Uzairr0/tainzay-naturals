import mongoose, { Document, Schema } from 'mongoose';

/** A prepaid payment option shown at checkout, e.g. a bank account or mobile wallet. */
export interface IPaymentMethod {
  /** Stable key stored on orders, e.g. `bank-transfer` */
  id: string;
  name: string;
  /** Account details shown to the customer (one per line) */
  details: string;
  enabled: boolean;
}

export interface ISiteSettings extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_PAYMENT_METHODS: IPaymentMethod[] = [
  {
    id: 'bank-transfer',
    name: 'Bank Transfer',
    details: 'Bank: [Bank name]\nAccount title: [Account title]\nAccount number: [Account number]\nIBAN: [IBAN]',
    enabled: true,
  },
  {
    id: 'jazzcash-easypaisa',
    name: 'JazzCash / Easypaisa',
    details: 'Account title: [Account title]\nJazzCash: [Mobile number]\nEasypaisa: [Mobile number]',
    enabled: true,
  },
];

export const DEFAULT_SITE_SETTINGS = {
  supportEmail: 'guzair421@gmail.com',
  phoneDisplay: '+92 304 1217777',
  phoneTel: '+923041217777',
  whatsappPhone: '923041217777',
  whatsappMessage: 'Hello, I am interested in Tainzy Naturals wellness products.',
  freeDeliveryMin: 1800,
  deliveryFee: 250,
  paymentMethods: DEFAULT_PAYMENT_METHODS,
  notifyEmailOnOrder: true,
  notifyWhatsAppOnOrder: true,
  notifyAdminOnReview: false,
};

const PaymentMethodSchema = new Schema<IPaymentMethod>(
  {
    id: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    details: { type: String, default: '', trim: true },
    enabled: { type: Boolean, default: true },
  },
  { _id: false },
);

const SiteSettingsSchema: Schema = new Schema(
  {
    supportEmail: { type: String, required: true, trim: true, lowercase: true },
    phoneDisplay: { type: String, required: true, trim: true },
    phoneTel: { type: String, required: true, trim: true },
    whatsappPhone: { type: String, required: true, trim: true },
    whatsappMessage: { type: String, required: true, trim: true },
    freeDeliveryMin: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, min: 0 },
    paymentMethods: {
      type: [PaymentMethodSchema],
      default: () => DEFAULT_PAYMENT_METHODS.map((method) => ({ ...method })),
    },
    notifyEmailOnOrder: { type: Boolean, default: true },
    notifyWhatsAppOnOrder: { type: Boolean, default: true },
    notifyAdminOnReview: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
