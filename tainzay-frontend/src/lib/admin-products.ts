import { productsApi } from '@/lib/api';
import type { Fetched } from '@/lib/catalogue';
import type { Product, ProductListResponse } from '@/types';

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

const emptyList = (): ProductListResponse => ({
  products: [],
  pagination: { page: 1, limit: 60, total: 0, totalPages: 1 },
});

export type AdminProductStockFilter = 'all' | 'in-stock' | 'out-of-stock';

export function parseAdminProductStockFilter(value: string | undefined): AdminProductStockFilter {
  if (value === 'in-stock' || value === 'out-of-stock') return value;
  return 'all';
}

export function buildProductsListHref(params: {
  search?: string;
  stock?: AdminProductStockFilter;
}) {
  const searchParams = new URLSearchParams();
  if (params.search?.trim()) searchParams.set('search', params.search.trim());
  if (params.stock && params.stock !== 'all') searchParams.set('stock', params.stock);
  const query = searchParams.toString();
  return query ? `/admin/products?${query}` : '/admin/products';
}

export async function fetchAdminProducts(params?: {
  search?: string;
  stock?: AdminProductStockFilter;
  page?: number;
}): Promise<Fetched<ProductListResponse>> {
  try {
    const response = await productsApi.getAll({
      page: params?.page ?? 1,
      limit: 60,
      sort: 'name-asc',
      search: params?.search?.trim() || undefined,
      inStock:
        params?.stock === 'in-stock' ? 'true' : params?.stock === 'out-of-stock' ? 'false' : undefined,
    });
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Failed to fetch admin products:', describeError(error));
    return { data: emptyList(), error: describeError(error) };
  }
}

export async function fetchAdminProduct(id: string): Promise<Fetched<Product | null>> {
  try {
    const response = await productsApi.getById(id);
    return { data: response.data, error: null };
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, describeError(error));
    return { data: null, error: describeError(error) };
  }
}
