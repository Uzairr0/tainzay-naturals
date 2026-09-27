import type { ProductImageFit } from '@/lib/cloudinary';

export interface WholesaleTier {
  minQuantity: number;
  price: number;
  discountPercentage?: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  image: string;
  images?: string[];
  /** How product photos are framed; defaults to `cutout` when absent. */
  imageFit?: ProductImageFit;
  basePrice: number;
  wholesaleTiers: WholesaleTier[];
  sku?: string;
  manufacturer?: string;
  activeIngredients?: string[];
  dosageForm?: string;
  packSize?: string;
  inStock: boolean;
  stockQuantity?: number;
  featured: boolean;
  /** Optional display rating (0–5). Used on product cards. */
  rating?: number;
  /** Optional review count shown next to stars. */
  reviewCount?: number;
  /** Up to 4 bullet points for the product highlights section */
  benefits?: string[];
  /** Full pack size line, e.g. "Pack Size: 500 Mg (60 Tablets)" */
  packSizeDetail?: string;
  /** Bold label under pack size, e.g. "60 Tablets" */
  packSizeLabel?: string;
  /** Selectable size/strength options shown as boxes */
  sizeOptions?: string[];
  /** Long-form bullets for the Product Details accordion */
  productDetails?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductListResponse {
  products: Product[];
  pagination: PaginationMeta;
}

export interface CategoryFacet {
  name: string;
  slug: string;
  count: number;
}

/** Sidebar counts and bounds from `GET /api/products/facets` */
export interface ProductFacets {
  categories: CategoryFacet[];
  priceRange: { min: number; max: number };
  availability: { inStock: number; outOfStock: number };
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteItem {
  product: string;
  productName: string;
  quantity: number;
  requestedPrice?: number;
}

export type PaymentStatus = 'awaiting_verification' | 'paid' | 'rejected';

export interface QuoteRequest {
  _id?: string;
  orderNumber?: string;
  source?: 'checkout' | 'quote';
  orderTotal?: number;
  /** Payment method id from site settings; legacy orders use `cod` / `card` */
  paymentMethod?: string;
  paymentMethodName?: string;
  paymentReference?: string;
  paymentStatus?: PaymentStatus;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  address?: string;
  items: QuoteItem[];
  message?: string;
  /** `closed` = dispatched/completed; closing a checkout order takes its items out of stock */
  status?: 'pending' | 'reviewed' | 'responded' | 'closed' | 'cancelled';
  closedAt?: string;
  stockDeducted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Stock movement caused by an order status change */
export interface StockChange {
  productName: string;
  before: number;
  after: number;
}

export interface QuoteStatusUpdateResponse extends QuoteRequest {
  stockChanges: StockChange[];
}

export interface QuoteFormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  address?: string;
  items: QuoteItem[];
  message?: string;
  source?: 'checkout' | 'quote';
  orderTotal?: number;
  paymentMethod?: string;
  paymentReference?: string;
}

export interface ReviewProductRef {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface Review {
  _id: string;
  product: ReviewProductRef | string;
  productName: string;
  productSlug: string;
  authorName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface ReviewListResponse {
  reviews: Review[];
  pagination: PaginationMeta;
}

export interface ReviewFormData {
  productSlug: string;
  authorName: string;
  email?: string;
  rating: number;
  comment: string;
}

export interface ReviewSubmitResponse {
  message: string;
  review: Review;
}

export interface AdminDashboardKpis {
  ordersThisWeek: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  pendingReviews: number;
  averageOrderValue: number;
  outOfStockProducts: number;
}

export interface AdminDashboardRecentOrder {
  _id: string;
  orderNumber?: string;
  contactPerson: string;
  orderTotal?: number;
  status?: QuoteRequest['status'];
  source?: QuoteRequest['source'];
  createdAt: string;
  productSummary: string;
}

export interface AdminDashboardPendingReview {
  _id: string;
  productName: string;
  productSlug: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AdminProductUpdate {
  basePrice: number;
  inStock: boolean;
  stockQuantity?: number;
  featured: boolean;
}

export interface AdminDashboardStats {
  kpis: AdminDashboardKpis;
  recentOrders: AdminDashboardRecentOrder[];
  pendingReviews: AdminDashboardPendingReview[];
}

export interface AdminNotificationOrder {
  _id: string;
  orderNumber?: string;
  contactPerson: string;
  orderTotal?: number;
  status: QuoteRequest['status'];
  source?: QuoteRequest['source'];
  createdAt: string;
  productSummary: string;
}

export interface AdminNotificationsResponse {
  pendingCount: number;
  orders: AdminNotificationOrder[];
}

/** A prepaid payment option configured in Admin → Settings */
export interface PaymentMethodOption {
  id: string;
  name: string;
  /** Account details shown to the customer, one per line */
  details: string;
  enabled: boolean;
}

export interface PublicSiteSettings {
  supportEmail: string;
  phoneDisplay: string;
  phoneTel: string;
  whatsappPhone: string;
  whatsappMessage: string;
  freeDeliveryMin: number;
  deliveryFee: number;
  /** Public settings list enabled methods only; admin settings list all of them */
  paymentMethods: PaymentMethodOption[];
}

export interface SiteSettings extends PublicSiteSettings {
  notifyEmailOnOrder: boolean;
  notifyWhatsAppOnOrder: boolean;
  notifyAdminOnReview: boolean;
  updatedAt?: string;
}

export interface NotificationChannelStatus {
  configured: boolean;
  provider: string;
}

export interface AdminSettingsResponse {
  settings: SiteSettings;
  notifications: {
    email: NotificationChannelStatus;
    whatsapp: NotificationChannelStatus;
  };
}
