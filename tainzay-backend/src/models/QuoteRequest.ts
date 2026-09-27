import mongoose, { Document, Schema } from 'mongoose';

export interface IQuoteItem {
  product: mongoose.Types.ObjectId;
  productName: string;
  quantity: number;
  requestedPrice?: number;
}

/** `closed` means dispatched/completed; `cancelled` orders never count as sales */
export const ORDER_STATUSES = ['pending', 'reviewed', 'responded', 'closed', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = ['awaiting_verification', 'paid', 'rejected'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export interface IQuoteRequest extends Document {
  orderNumber?: string;
  source?: 'checkout' | 'quote';
  orderTotal?: number;
  /** Payment method id from site settings; legacy orders use `cod` / `card` */
  paymentMethod?: string;
  /** Method name at the time of the order, so renaming a method keeps old orders readable */
  paymentMethodName?: string;
  /** Transaction ID the customer entered after paying */
  paymentReference?: string;
  paymentStatus?: PaymentStatus;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  address?: string;
  items: IQuoteItem[];
  message?: string;
  status: OrderStatus;
  /** When a checkout order was closed (dispatched); revenue is counted by this date */
  closedAt?: Date;
  /** True while this order's quantities are subtracted from product stock */
  stockDeducted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteItemSchema: Schema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  requestedPrice: {
    type: Number,
  },
});

const QuoteRequestSchema: Schema = new Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    source: {
      type: String,
      enum: ['checkout', 'quote'],
      default: 'quote',
    },
    orderTotal: {
      type: Number,
      min: 0,
    },
    paymentMethod: {
      type: String,
      trim: true,
    },
    paymentMethodName: {
      type: String,
      trim: true,
    },
    paymentReference: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    contactPerson: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    whatsappNumber: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    items: [QuoteItemSchema],
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: 'pending',
    },
    closedAt: {
      type: Date,
    },
    stockDeducted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IQuoteRequest>('QuoteRequest', QuoteRequestSchema);
