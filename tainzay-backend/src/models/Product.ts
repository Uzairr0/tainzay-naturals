import mongoose, { Document, Schema } from 'mongoose';

export interface IWholesaleTier {
  minQuantity: number;
  price: number;
  discountPercentage?: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  /** Optional so products can be seeded before copy is written */
  description: string;
  category: mongoose.Types.ObjectId;
  image: string;
  images?: string[];
  basePrice: number;
  wholesaleTiers: IWholesaleTier[];
  sku?: string;
  manufacturer?: string;
  activeIngredients?: string[];
  dosageForm?: string;
  packSize?: string;
  benefits?: string[];
  packSizeDetail?: string;
  packSizeLabel?: string;
  sizeOptions?: string[];
  /** Long-form bullets for the Product Details accordion */
  productDetails?: string[];
  inStock: boolean;
  stockQuantity?: number;
  featured: boolean;
  /** Average rating from approved customer reviews (0–5). */
  rating?: number;
  /** Count of approved customer reviews. */
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const WholesaleTierSchema: Schema = new Schema({
  minQuantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPercentage: {
    type: Number,
  },
});

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    images: [{
      type: String,
    }],
    basePrice: {
      type: Number,
      required: true,
    },
    wholesaleTiers: [WholesaleTierSchema],
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    manufacturer: {
      type: String,
    },
    activeIngredients: [{
      type: String,
    }],
    dosageForm: {
      type: String,
    },
    packSize: {
      type: String,
    },
    benefits: [{
      type: String,
    }],
    packSizeDetail: {
      type: String,
    },
    packSizeLabel: {
      type: String,
    },
    sizeOptions: [{
      type: String,
    }],
    productDetails: [{
      type: String,
    }],
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ featured: -1, createdAt: -1 });
ProductSchema.index({ category: 1, featured: -1, createdAt: -1 });
ProductSchema.index({ inStock: 1 });
ProductSchema.index({ basePrice: 1 });
ProductSchema.index({ name: 'text', description: 'text', manufacturer: 'text' });

export default mongoose.model<IProduct>('Product', ProductSchema);
