const SKELETON_COUNT = 8;

/** Card-shaped placeholders that match the listing grid so the layout doesn't jump */
export default function ProductGridSkeleton({ count = SKELETON_COUNT }: { count?: number }) {
  return (
    <div className="product-grid" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading products</span>
      {Array.from({ length: count }).map((_, index) => (
        <article key={index} className="product-card product-card-skeleton" aria-hidden="true">
          <div className="product-card-media skeleton-pulse" />
          <div className="product-card-body">
            <span className="skeleton-line skeleton-line-title skeleton-pulse" />
            <span className="skeleton-line skeleton-line-meta skeleton-pulse" />
            <span className="skeleton-line skeleton-line-price skeleton-pulse" />
          </div>
        </article>
      ))}
    </div>
  );
}
