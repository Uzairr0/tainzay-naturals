import { formatPrice } from '@/lib/format';

/**
 * Catalogue filter state lives in the URL query string rather than component
 * state, so every combination is shareable, bookmarkable and survives the back
 * button. This module is the single place that translates between the URL, the
 * filter object components read, and the API's query parameters.
 */

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'best-selling', label: 'Best selling' },
  { value: 'name-asc', label: 'Alphabetically, A-Z' },
  { value: 'name-desc', label: 'Alphabetically, Z-A' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
  { value: 'date-asc', label: 'Date, old to new' },
  { value: 'date-desc', label: 'Date, new to old' },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]['value'];
export type Availability = 'in-stock' | 'out-of-stock';
export type CatalogCollection = 'offers' | 'best-selling' | 'new-arrivals';

export const DEFAULT_SORT: SortValue = 'featured';
/** 12 fills two rows of four on desktop and gives the current 16-item catalogue two pages */
export const DEFAULT_PAGE_SIZE = 12;
/** Matches the cap enforced by the API */
const MAX_PAGE_SIZE = 60;

export interface ProductFilters {
  category?: string;
  collection?: CatalogCollection;
  availability?: Availability;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort: SortValue;
  page: number;
}

export const EMPTY_FILTERS: ProductFilters = { sort: DEFAULT_SORT, page: 1 };

/** Next.js server components hand over a plain record; client hooks a URLSearchParams */
export type SearchParamsInput =
  | URLSearchParams
  | Record<string, string | string[] | undefined>;

function readParam(input: SearchParamsInput, key: string): string | undefined {
  const value = input instanceof URLSearchParams ? input.get(key) : input[key];
  const first = Array.isArray(value) ? value[0] : value;
  const trimmed = typeof first === 'string' ? first.trim() : '';
  return trimmed === '' ? undefined : trimmed;
}

function isSortValue(value: string | undefined): value is SortValue {
  return SORT_OPTIONS.some((option) => option.value === value);
}

function toPage(value: string | undefined): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function toPrice(value: string | undefined): number | undefined {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function isCatalogCollection(value: string | undefined): value is CatalogCollection {
  return value === 'offers' || value === 'best-selling' || value === 'new-arrivals';
}

function readCollection(input: SearchParamsInput): CatalogCollection | undefined {
  const filter = readParam(input, 'filter');
  if (isCatalogCollection(filter)) {
    return filter;
  }

  // Legacy nav links that used sort-only query params
  if (filter) return undefined;

  const sort = readParam(input, 'sort');
  const hasOtherFilters = Boolean(
    readParam(input, 'category') ||
      readParam(input, 'search') ||
      readParam(input, 'availability') ||
      readParam(input, 'minPrice') ||
      readParam(input, 'maxPrice'),
  );

  if (hasOtherFilters) return undefined;
  if (sort === 'best-selling') return 'best-selling';
  if (sort === 'date-desc') return 'new-arrivals';

  return undefined;
}

/**
 * Reads filters out of a URL. Anything malformed falls back to its default so a
 * hand-edited or stale address still renders a usable page instead of an error.
 */
export function parseProductFilters(input: SearchParamsInput): ProductFilters {
  const sort = readParam(input, 'sort');
  const availability = readParam(input, 'availability');
  let minPrice = toPrice(readParam(input, 'minPrice'));
  let maxPrice = toPrice(readParam(input, 'maxPrice'));
  const collection = readCollection(input);

  // A reversed range would return nothing, which reads as a bug to the visitor
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }

  return {
    category: readParam(input, 'category'),
    collection,
    availability:
      availability === 'in-stock' || availability === 'out-of-stock'
        ? availability
        : undefined,
    minPrice,
    maxPrice,
    search: readParam(input, 'search'),
    sort: isSortValue(sort) ? sort : DEFAULT_SORT,
    page: toPage(readParam(input, 'page')),
  };
}

/** Defaults are left out so shared links stay short and readable */
export function filtersToSearchParams(filters: ProductFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.category) params.set('category', filters.category);
  if (filters.collection) params.set('filter', filters.collection);
  if (filters.availability) params.set('availability', filters.availability);
  if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
  if (filters.search) params.set('search', filters.search);
  if (filters.sort !== DEFAULT_SORT) params.set('sort', filters.sort);
  if (filters.page > 1) params.set('page', String(filters.page));

  return params;
}

export function filtersToHref(filters: ProductFilters, basePath = '/products'): string {
  const query = filtersToSearchParams(filters).toString();
  return query ? `${basePath}?${query}` : basePath;
}

/**
 * Applies a change to the current filters. Any change other than paging sends
 * the visitor back to page one, since page 4 of a narrower result set is
 * usually empty.
 */
export function applyFilterPatch(
  filters: ProductFilters,
  patch: Partial<ProductFilters>
): ProductFilters {
  const next = { ...filters, ...patch };
  return 'page' in patch ? next : { ...next, page: 1 };
}

export function clearFilters(filters: ProductFilters): ProductFilters {
  return { sort: filters.sort, page: 1 };
}

export function hasActiveFilters(filters: ProductFilters): boolean {
  return Boolean(
    filters.category ||
      filters.collection ||
      filters.availability ||
      filters.search ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined
  );
}

/** Removable filter summaries rendered as chips above the product grid */
export interface FilterChip {
  key: string;
  label: string;
  /** Patch that removes this chip's filter */
  patch: Partial<ProductFilters>;
}

export function getFilterChips(
  filters: ProductFilters,
  categoryLabels: Record<string, string> = {}
): FilterChip[] {
  const chips: FilterChip[] = [];

  if (filters.category) {
    chips.push({
      key: 'category',
      label: categoryLabels[filters.category] ?? filters.category,
      patch: { category: undefined },
    });
  }

  if (filters.collection) {
    const collectionLabels: Record<CatalogCollection, string> = {
      offers: 'Discount & Offers',
      'best-selling': 'Best Selling',
      'new-arrivals': 'New Arrivals',
    };

    chips.push({
      key: 'collection',
      label: collectionLabels[filters.collection],
      patch: { collection: undefined },
    });
  }

  if (filters.availability) {
    chips.push({
      key: 'availability',
      label: filters.availability === 'in-stock' ? 'In stock' : 'Out of stock',
      patch: { availability: undefined },
    });
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const min = filters.minPrice;
    const max = filters.maxPrice;
    const label =
      min !== undefined && max !== undefined
        ? `${formatPrice(min)} – ${formatPrice(max)}`
        : min !== undefined
          ? `From ${formatPrice(min)}`
          : `Up to ${formatPrice(max as number)}`;

    chips.push({
      key: 'price',
      label,
      patch: { minPrice: undefined, maxPrice: undefined },
    });
  }

  if (filters.search) {
    chips.push({
      key: 'search',
      label: `“${filters.search}”`,
      patch: { search: undefined },
    });
  }

  return chips;
}

/** Query parameters accepted by `GET /api/products` and `/api/products/facets` */
export interface ProductQueryParams {
  category?: string;
  inStock?: 'true' | 'false';
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: SortValue;
  page?: number;
  limit?: number;
  featured?: 'true';
}

export function filtersToQueryParams(
  filters: ProductFilters,
  pageSize = DEFAULT_PAGE_SIZE
): ProductQueryParams {
  return {
    ...(filters.category ? { category: filters.category } : {}),
    ...(filters.availability
      ? { inStock: filters.availability === 'in-stock' ? ('true' as const) : ('false' as const) }
      : {}),
    ...(filters.minPrice !== undefined ? { minPrice: filters.minPrice } : {}),
    ...(filters.maxPrice !== undefined ? { maxPrice: filters.maxPrice } : {}),
    ...(filters.search ? { search: filters.search } : {}),
    sort: filters.sort,
    page: filters.page,
    limit: Math.min(pageSize, MAX_PAGE_SIZE),
  };
}
