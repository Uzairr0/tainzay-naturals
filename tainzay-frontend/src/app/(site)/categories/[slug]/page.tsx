import type { Metadata } from 'next';
import { buildCategoryMetadata } from '@/lib/site-seo';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
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
import { fetchCatalogSegments } from '@/lib/catalog-segments';
import { CATEGORY_LABELS, HOME_CATEGORIES } from '@/lib/categories';
import { parseProductFilters } from '@/lib/product-filters';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export function generateStaticParams() {
  return HOME_CATEGORIES.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = CATEGORY_LABELS[slug];
  if (!name) return {};

  return buildCategoryMetadata(name, slug);
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const categoryName = CATEGORY_LABELS[slug];
  if (!categoryName) {
    notFound();
  }

  return (
    <FilterDrawerProvider>
      <div className="collection-page">
        <CollectionBanner />

        <div className="container-wide">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'All Products', href: '/products' },
              { label: categoryName },
            ]}
          />
          <Suspense fallback={<CollectionFallback />}>
            <CategoryBody
              slug={slug}
              title={categoryName}
              searchParams={searchParams}
            />
          </Suspense>
        </div>
      </div>
    </FilterDrawerProvider>
  );
}

async function CategoryBody({
  slug,
  title,
  searchParams,
}: {
  slug: string;
  title: string;
  searchParams: CategoryPageProps['searchParams'];
}) {
  const parsed = parseProductFilters(await searchParams);
  const requested = { ...parsed, category: slug };

  const [initialList, facets, segments] = await Promise.all([
    fetchProductList(requested),
    fetchProductFacets(requested),
    fetchCatalogSegments(),
  ]);

  const lastPage = initialList.data.pagination.totalPages;
  const pageOutOfRange =
    !initialList.error &&
    initialList.data.pagination.total > 0 &&
    requested.page > lastPage;

  const list = pageOutOfRange
    ? await fetchProductList({ ...requested, page: lastPage })
    : initialList;
  const filters = pageOutOfRange ? { ...requested, page: lastPage } : requested;

  const { data, error } = list;
  const { products, pagination } = data;

  if (error) {
    return (
      <>
        <header className="collection-head">
          <h1 className="collection-title">{title}</h1>
        </header>
        <div className="collection-notice" role="alert">
          <p className="collection-notice-title">We couldn&apos;t load this category</p>
          <p className="collection-notice-text">
            This is usually temporary. Please refresh the page, or{' '}
            <Link href="/contact" className="collection-notice-link">
              contact us
            </Link>{' '}
            and we&apos;ll share the latest category sheet directly.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="collection-head">
        <h1 className="collection-title">{title}</h1>
        <CollectionToolbar pagination={pagination} />
      </header>

      <div className="collection-layout">
        <aside className="collection-sidebar" aria-label="Product filters">
          <FilterPanel
            facets={facets.data}
            showCategoryGroup={false}
          />
        </aside>

        <div className="collection-main" id="collection-products">
          <ActiveFilterChips />
          <CollectionResults
            products={products}
            filters={filters}
            segments={segments}
          />
          <Pagination pagination={pagination} />
          {pageOutOfRange && <SyncPageParam page={lastPage} />}
        </div>
      </div>

      <FilterDrawer>
        <MobileFilterDrawerContent
          facets={facets.data}
          showCategoryGroup={false}
        />
      </FilterDrawer>
    </>
  );
}
