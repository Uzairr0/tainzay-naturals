import mongoose, { Document, Schema } from 'mongoose';

export interface IQuoteItem {
  product: mongoose.Types.ObjectId;
  productName: string;
  quantity: number;
  requestedPrice?: number;
}

export interface IQuoteRequest extends Document {
  orderNumber?: string;
  source?: 'checkout' | 'quote';
  orderTotal?: number;
  paymentMethod?: 'cod' | 'card';
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  address?: string;
  items: IQuoteItem[];
  message?: string;
  status: 'pending' | 'reviewed' | 'responded' | 'closed';
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
      enum: ['cod', 'card'],
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
      enum: ['pending', 'reviewed', 'responded', 'closed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IQuoteRequest>('QuoteRequest', QuoteRequestSchema);
