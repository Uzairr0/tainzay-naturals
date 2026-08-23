import { fetchFeaturedProducts, fetchProductList } from '@/lib/catalogue';
import { EMPTY_FILTERS } from '@/lib/product-filters';
import { excludeOfferProducts, getOfferProducts, isOfferProduct } from '@/lib/product-offers';
import type { Product } from '@/types';

export const NEW_ARRIVALS_LIMIT = 8;
const CATALOGUE_SCAN_LIMIT = 60;

export type CatalogCollection = 'offers' | 'best-selling' | 'new-arrivals';

export interface CatalogSegments {
  offers: Product[];
  bestSelling: Product[];
  newArrivals: Product[];
}

export interface ProductListingDisplay {
  showDiscount: boolean;
  badgeLabel?: string;
}

export async function fetchCatalogSegments(): Promise<CatalogSegments> {
  const [featured, recent] = await Promise.all([
    fetchFeaturedProducts(),
    fetchProductList({ ...EMPTY_FILTERS, sort: 'date-desc' }, CATALOGUE_SCAN_LIMIT),
  ]);

  const offers = getOfferProducts(recent.data.products);
  const bestSelling = excludeOfferProducts(featured.data);
  const bestSellingSlugs = new Set(bestSelling.map((product) => product.slug));
  const newArrivals = excludeOfferProducts(recent.data.products)
    .filter((product) => !bestSellingSlugs.has(product.slug))
    .slice(0, NEW_ARRIVALS_LIMIT);

  return { offers, bestSelling, newArrivals };
}

export function getProductsForCollection(
  segments: CatalogSegments,
  collection: CatalogCollection,
): Product[] {
  switch (collection) {
    case 'offers':
      return segments.offers;
    case 'best-selling':
      return segments.bestSelling;
    case 'new-arrivals':
      return segments.newArrivals;
  }
}

export function getListingDisplayForProduct(
  product: Product,
  segments: CatalogSegments,
  collection?: CatalogCollection,
): ProductListingDisplay {
  if (collection === 'offers') {
    return { showDiscount: isOfferProduct(product) };
  }

  if (collection === 'best-selling') {
    return { showDiscount: false, badgeLabel: 'Best Selling' };
  }

  if (collection === 'new-arrivals') {
    return { showDiscount: false, badgeLabel: 'New Arrivals' };
  }

  if (isOfferProduct(product)) {
    return { showDiscount: true };
  }

  if (segments.bestSelling.some((item) => item.slug === product.slug)) {
    return { showDiscount: false, badgeLabel: 'Best Selling' };
  }

  if (segments.newArrivals.some((item) => item.slug === product.slug)) {
    return { showDiscount: false, badgeLabel: 'New Arrivals' };
  }

  return { showDiscount: false };
}

/** Apply sidebar filters to a fixed segment list (offers, best selling, etc.) */
export function applyClientFilters(
  products: Product[],
  filters: {
    category?: string;
    availability?: 'in-stock' | 'out-of-stock';
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  },
): Product[] {
  return products.filter((product) => {
    if (filters.category && product.category?.slug !== filters.category) {
      return false;
    }

    if (filters.availability === 'in-stock' && !product.inStock) {
      return false;
    }

    if (filters.availability === 'out-of-stock' && product.inStock) {
      return false;
    }

    if (filters.minPrice !== undefined && product.basePrice < filters.minPrice) {
      return false;
    }

    if (filters.maxPrice !== undefined && product.basePrice > filters.maxPrice) {
      return false;
    }

    if (filters.search) {
      const term = filters.search.toLowerCase();
      const haystack = [
        product.name,
        product.description,
        product.manufacturer,
        ...(product.activeIngredients ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(term)) {
        return false;
      }
    }

    return true;
  });
}

export function sortProductsClient(products: Product[], sort: string): Product[] {
  const sorted = [...products];

  switch (sort) {
    case 'name-desc':
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'price-asc':
      sorted.sort((a, b) => a.basePrice - b.basePrice);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.basePrice - a.basePrice);
      break;
    case 'date-asc':
      sorted.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      break;
    case 'date-desc':
      sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
    case 'name-asc':
    default:
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return sorted;
}

export function paginateProducts<T>(
  products: T[],
  page: number,
  pageSize: number,
): { items: T[]; total: number; totalPages: number; page: number } {
  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: products.slice(start, start + pageSize),
    total,
    totalPages,
    page: safePage,
  };
}

export const COLLECTION_PAGE_TITLES: Record<CatalogCollection, string> = {
  offers: 'Discount & Offers',
  'best-selling': 'Best Selling',
  'new-arrivals': 'New Arrivals',
};
