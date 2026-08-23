import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';

/** Shown while the listing server component is fetching a new result set */
export default function CollectionFallback() {
  return (
    <>
      <header className="collection-head">
        <h1 className="collection-title">All Products</h1>
        <div className="collection-toolbar">
          <p className="collection-summary skeleton-line skeleton-line-meta skeleton-pulse" />
        </div>
      </header>
      <div className="collection-layout">
        <aside className="collection-sidebar" aria-hidden="true">
          <div className="filter-panel">
            {Array.from({ length: 8 }).map((_, index) => (
              <span key={index} className="skeleton-line skeleton-line-title skeleton-pulse" />
            ))}
          </div>
        </aside>
        <div className="collection-main">
          <ProductGridSkeleton />
        </div>
      </div>
    </>
  );
}
