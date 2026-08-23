import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import CollectionBanner from '@/components/products/CollectionBanner';
import CollectionToolbar from '@/components/products/CollectionToolbar';
import CollectionFallback from '@/components/products/CollectionFallback';
import CollectionResults from '@/components/products/CollectionResults';
import FilterPanel from '@/components/products/FilterPanel';
import ActiveFilterChips from '@/components/products/ActiveFilterChips';
import Pagination from '@/components/products/Pagination';
import SyncPageParam from '@/components/products/SyncPageParam';
import MobileFilterDrawerContent from '@/components/products/MobileFilterDrawerContent';
import {
  FilterDrawer,
  FilterDrawerProvider,
} from '@/components/products/FilterDrawer';
import { fetchProductFacets, fetchProductList } from '@/lib/catalogue';
import {
  applyClientFilters,
  COLLECTION_PAGE_TITLES,
  fetchCatalogSegments,
  getProductsForCollection,
  paginateProducts,
  sortProductsClient,
} from '@/lib/catalog-segments';
import {
  DEFAULT_PAGE_SIZE,
  parseProductFilters,
  type ProductFilters,
} from '@/lib/product-filters';
import { PRODUCTS_LIST_METADATA } from '@/lib/site-seo';
import type { PaginationMeta } from '@/types';

export const metadata: Metadata = PRODUCTS_LIST_METADATA;

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <FilterDrawerProvider>
      <div className="collection-page">
        <CollectionBanner />

        <div className="container-wide">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'All Products' }]} />
          <Suspense fallback={<CollectionFallback />}>
            <ProductsBody searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </FilterDrawerProvider>
  );
}

async function loadCollectionListing(filters: ProductFilters) {
  const segments = await fetchCatalogSegments();
  const collection = filters.collection!;

  const filtered = sortProductsClient(
    applyClientFilters(getProductsForCollection(segments, collection), filters),
    filters.sort,
  );

  const lastPage = Math.max(1, Math.ceil(filtered.length / DEFAULT_PAGE_SIZE));
  const pageOutOfRange = filtered.length > 0 && filters.page > lastPage;
  const page = pageOutOfRange ? lastPage : filters.page;
  const paged = paginateProducts(filtered, page, DEFAULT_PAGE_SIZE);

  const pagination: PaginationMeta = {
    page: paged.page,
    limit: DEFAULT_PAGE_SIZE,
    total: paged.total,
    totalPages: paged.totalPages,
  };

  return {
    segments,
    products: paged.items,
    pagination,
    filters: pageOutOfRange ? { ...filters, page } : filters,
    pageOutOfRange,
    lastPage,
  };
}

async function loadCatalogListing(filters: ProductFilters) {
  const [initialList, facets, segments] = await Promise.all([
    fetchProductList(filters),
    fetchProductFacets(filters),
    fetchCatalogSegments(),
  ]);

  const lastPage = initialList.data.pagination.totalPages;
  const pageOutOfRange =
    !initialList.error &&
    initialList.data.pagination.total > 0 &&
    filters.page > lastPage;

  const list = pageOutOfRange
    ? await fetchProductList({ ...filters, page: lastPage })
    : initialList;

  return {
    segments,
    facets: facets.data,
    facetsError: facets.error,
    products: list.data.products,
    pagination: list.data.pagination,
    filters: pageOutOfRange ? { ...filters, page: lastPage } : filters,
    pageOutOfRange,
    lastPage,
    error: list.error,
  };
}

async function ProductsBody({
  searchParams,
}: {
  searchParams: ProductsPageProps['searchParams'];
}) {
  const requested = parseProductFilters(await searchParams);

  if (requested.collection) {
    const [listing, facets] = await Promise.all([
      loadCollectionListing(requested),
      fetchProductFacets(requested),
    ]);

    const pageTitle = COLLECTION_PAGE_TITLES[requested.collection];

    return (
      <>
        <header className="collection-head">
          <h1 className="collection-title">{pageTitle}</h1>
          <CollectionToolbar pagination={listing.pagination} />
        </header>

        <div className="collection-layout">
          <aside className="collection-sidebar" aria-label="Product filters">
            <FilterPanel facets={facets.data} />
          </aside>

          <div className="collection-main" id="collection-products">
            <ActiveFilterChips />
            <CollectionResults
              products={listing.products}
              filters={listing.filters}
              segments={listing.segments}
            />
            <Pagination pagination={listing.pagination} />
            {listing.pageOutOfRange && <SyncPageParam page={listing.lastPage} />}
          </div>
        </div>

        <FilterDrawer>
          <MobileFilterDrawerContent facets={facets.data} />
        </FilterDrawer>
      </>
    );
  }

  const listing = await loadCatalogListing(requested);

  if (listing.error) {
    return (
      <>
        <header className="collection-head">
          <h1 className="collection-title">All Products</h1>
        </header>
        <div className="collection-notice" role="alert">
          <p className="collection-notice-title">We couldn&apos;t load the catalogue</p>
          <p className="collection-notice-text">
            This is usually temporary. Please refresh the page, or{' '}
            <Link href="/contact" className="collection-notice-link">
              contact us
            </Link>{' '}
            and we&apos;ll send you the product list directly.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="collection-head">
        <h1 className="collection-title">All Products</h1>
        <CollectionToolbar pagination={listing.pagination} />
      </header>

      <div className="collection-layout">
        <aside className="collection-sidebar" aria-label="Product filters">
          <FilterPanel facets={listing.facets} />
        </aside>

        <div className="collection-main" id="collection-products">
          <ActiveFilterChips />
          <CollectionResults
            products={listing.products}
            filters={listing.filters}
            segments={listing.segments}
          />
          <Pagination pagination={listing.pagination} />
          {listing.pageOutOfRange && <SyncPageParam page={listing.lastPage} />}
        </div>
      </div>

      <FilterDrawer>
        <MobileFilterDrawerContent facets={listing.facets} />
      </FilterDrawer>
    </>
  );
}
