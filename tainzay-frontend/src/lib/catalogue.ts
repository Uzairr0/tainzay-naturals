import { cache } from 'react';
import { buildNavMenuCategories, type NavMenuCategory } from '@/lib/nav-menu';
import {
  DEFAULT_PAGE_SIZE,
  filtersToQueryParams,
  type ProductFilters,
} from '@/lib/product-filters';
import { fetchServerJsonCached, REVALIDATE, toQueryRecord } from '@/lib/server-api';
import type { Product, ProductFacets, ProductListResponse } from '@/types';

/**
 * Catalogue reads used by server components. Responses are cached by Next.js
 * and deduped within a request via React cache().
 */
export interface Fetched<T> {
  data: T;
  error: string | null;
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

const emptyList = (limit: number): ProductListResponse => ({
  products: [],
  pagination: { page: 1, limit, total: 0, totalPages: 1 },
});

const EMPTY_FACETS: ProductFacets = {
  categories: [],
  priceRange: { min: 0, max: 0 },
  availability: { inStock: 0, outOfStock: 0 },
};

export async function fetchProductList(
  filters: ProductFilters,
  pageSize = DEFAULT_PAGE_SIZE,
): Promise<Fetched<ProductListResponse>> {
  try {
    const data = await fetchServerJsonCached<ProductListResponse>(
      '/products',
      REVALIDATE.catalogue,
      toQueryRecord(filtersToQueryParams(filters, pageSize) as Record<string, string | number | boolean | undefined>),
    );
    return { data, error: null };
  } catch (error) {
    console.error('Failed to fetch products:', describeError(error));
    return { data: emptyList(pageSize), error: describeError(error) };
  }
}

export async function fetchProductFacets(
  filters: ProductFilters,
): Promise<Fetched<ProductFacets>> {
  try {
    const { category, inStock, minPrice, maxPrice, search } = filtersToQueryParams(filters);
    const data = await fetchServerJsonCached<ProductFacets>(
      '/products/facets',
      REVALIDATE.catalogue,
      toQueryRecord({ category, inStock, minPrice, maxPrice, search }),
    );
    return { data, error: null };
  } catch (error) {
    console.error('Failed to fetch product facets:', describeError(error));
    return { data: EMPTY_FACETS, error: describeError(error) };
  }
}

export const fetchFeaturedProducts = cache(async (limit?: number): Promise<Fetched<Product[]>> => {
  try {
    const data = await fetchServerJsonCached<Product[]>(
      '/products/featured',
      REVALIDATE.catalogue,
      limit ? { limit } : undefined,
    );
    return { data, error: null };
  } catch (error) {
    console.error('Failed to fetch featured products:', describeError(error));
    return { data: [], error: describeError(error) };
  }
});

/** Categories + products for the All Products nav mega menu */
export const fetchNavMenuData = cache(async (): Promise<Fetched<NavMenuCategory[]>> => {
  try {
    const data = await fetchServerJsonCached<ProductListResponse>(
      '/products',
      REVALIDATE.catalogue,
      { sort: 'name-asc', page: 1, limit: 100 },
    );

    return {
      data: buildNavMenuCategories(data.products),
      error: null,
    };
  } catch (error) {
    console.error('Failed to fetch nav menu data:', describeError(error));
    return { data: [], error: describeError(error) };
  }
});

/** Resolves to null for a missing product so the caller can render notFound() */
export const fetchProductBySlug = cache(async (slug: string): Promise<Fetched<Product | null>> => {
  try {
    const data = await fetchServerJsonCached<Product>(
      `/products/${slug}`,
      REVALIDATE.catalogue,
    );
    return { data, error: null };
  } catch (error) {
    console.error(`Failed to fetch product "${slug}":`, describeError(error));
    return { data: null, error: describeError(error) };
  }
});

/** Same-category products for the product detail page, excluding the current item */
export async function fetchRelatedProducts(
  product: Product,
  limit = 8,
): Promise<Fetched<Product[]>> {
  const categorySlug = product.category?.slug;
  if (!categorySlug) {
    return { data: [], error: null };
  }

  try {
    const response = await fetchProductList(
      { category: categorySlug, sort: 'featured', page: 1 },
      limit + 1,
    );

    if (response.error) {
      return { data: [], error: response.error };
    }

    const related = response.data.products
      .filter((item) => item.slug !== product.slug)
      .slice(0, limit);

    return { data: related, error: null };
  } catch (error) {
    console.error(`Failed to fetch related products for "${product.slug}":`, describeError(error));
    return { data: [], error: describeError(error) };
  }
}

/** All product slugs for static generation and sitemap helpers. */
export async function fetchAllProductSlugs(): Promise<string[]> {
  try {
    const data = await fetchServerJsonCached<ProductListResponse>(
      '/products',
      REVALIDATE.catalogue,
      { page: 1, limit: 500, sort: 'name-asc' },
    );
    return data.products.map((product) => product.slug);
  } catch (error) {
    console.error('Failed to fetch product slugs:', describeError(error));
    return [];
  }
}
