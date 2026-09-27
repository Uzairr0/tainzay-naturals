import axios from 'axios';
import type { ProductQueryParams } from '@/lib/product-filters';
import type {
  Category,
  Product,
  ProductFacets,
  ProductListResponse,
  QuoteFormData,
  QuoteRequest,
  QuoteStatusUpdateResponse,
  Review,
  ReviewFormData,
  ReviewListResponse,
  ReviewSubmitResponse,
  AdminDashboardStats,
  AdminNotificationsResponse,
  AdminProductUpdate,
  AdminSettingsResponse,
  PublicSiteSettings,
  SiteSettings,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

/**
 * Admin endpoints need the backend's admin secret. On the Next.js server we add
 * it directly; in the browser we go through /api/admin/backend, which checks the
 * login cookie and adds the secret there, so it never reaches client code.
 */
const adminServerApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.ADMIN_SESSION_SECRET ?? ''}`,
  },
  timeout: 15000,
});

const adminBrowserApi = axios.create({
  baseURL: '/api/admin/backend',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

function adminApiClient() {
  return typeof window === 'undefined' ? adminServerApi : adminBrowserApi;
}

// Products
export const productsApi = {
  getAll: (params?: ProductQueryParams) =>
    api.get<ProductListResponse>('/products', { params }),
  getFacets: (params?: Omit<ProductQueryParams, 'page' | 'limit' | 'sort'>) =>
    api.get<ProductFacets>('/products/facets', { params }),
  getBySlug: (slug: string) => api.get<Product>(`/products/${slug}`),
  getByCategory: (slug: string) => api.get<Product[]>(`/products/category/${slug}`),
  getFeatured: (limit?: number) =>
    api.get<Product[]>('/products/featured', { params: limit ? { limit } : undefined }),
  getById: (id: string) => adminApiClient().get<Product>(`/products/id/${id}`),
  update: (id: string, data: AdminProductUpdate) =>
    adminApiClient().put<Product>(`/products/${id}`, data),
};

// Categories
export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories'),
  getBySlug: (slug: string) => api.get<Category>(`/categories/${slug}`),
};

// Quotes
export const quotesApi = {
  create: (data: QuoteFormData) => api.post<QuoteRequest>('/quotes', data),
  getAll: (params?: {
    status?: NonNullable<QuoteRequest['status']>;
    source?: NonNullable<QuoteRequest['source']>;
  }) => adminApiClient().get<QuoteRequest[]>('/quotes', { params }),
  getById: (id: string) => adminApiClient().get<QuoteRequest>(`/quotes/${id}`),
  updateStatus: (id: string, status: NonNullable<QuoteRequest['status']>) =>
    adminApiClient().patch<QuoteStatusUpdateResponse>(`/quotes/${id}/status`, { status }),
  updatePaymentStatus: (id: string, paymentStatus: NonNullable<QuoteRequest['paymentStatus']>) =>
    adminApiClient().patch<QuoteRequest>(`/quotes/${id}/payment-status`, { paymentStatus }),
};

// Reviews
export const reviewsApi = {
  getApproved: (params?: { page?: number; limit?: number; product?: string }) =>
    api.get<ReviewListResponse>('/reviews/approved', { params }),
  getByProduct: (slug: string, params?: { page?: number; limit?: number }) =>
    api.get<ReviewListResponse>(`/reviews/product/${slug}`, { params }),
  getAll: (params?: { status?: Review['status'] }) =>
    adminApiClient().get<Review[]>('/reviews', { params }),
  create: (data: ReviewFormData) => api.post<ReviewSubmitResponse>('/reviews', data),
  updateStatus: (id: string, status: Review['status']) =>
    adminApiClient().patch<Review>(`/reviews/${id}/status`, { status }),
};

// Admin
export const adminApi = {
  getDashboard: () => adminApiClient().get<AdminDashboardStats>('/admin/dashboard'),
  getNotifications: () =>
    adminApiClient().get<AdminNotificationsResponse>('/admin/notifications'),
  getSettings: () => adminApiClient().get<AdminSettingsResponse>('/admin/settings'),
  updateSettings: (data: Partial<SiteSettings>) =>
    adminApiClient().patch<AdminSettingsResponse>('/admin/settings', data),
};

// Public settings
export const settingsApi = {
  getPublic: () => api.get<PublicSiteSettings>('/settings'),
};

export default api;
