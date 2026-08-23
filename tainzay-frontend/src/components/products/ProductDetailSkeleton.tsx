export default function ProductDetailSkeleton() {
  return (
    <div className="product-detail-page" aria-busy="true" aria-label="Loading product">
      <div className="container-wide">
        <div className="skeleton-line skeleton-line-meta skeleton-pulse pdp-skeleton-breadcrumb" />

        <div className="product-detail-layout">
          <div className="product-detail-gallery">
            <div className="pdp-skeleton-gallery skeleton-pulse" />
            <div className="pdp-skeleton-thumbs">
              {Array.from({ length: 4 }).map((_, index) => (
                <span key={index} className="pdp-skeleton-thumb skeleton-pulse" />
              ))}
            </div>
          </div>

          <div className="product-detail-info">
            <span className="skeleton-line skeleton-line-meta skeleton-pulse" />
            <span className="skeleton-line skeleton-line-title skeleton-pulse pdp-skeleton-title" />
            <span className="skeleton-line skeleton-line-meta skeleton-pulse" />
            <span className="skeleton-line skeleton-line-price skeleton-pulse" />
            <span className="skeleton-line skeleton-line-meta skeleton-pulse" />
            <span className="skeleton-line skeleton-line-meta skeleton-pulse" />
            <div className="pdp-skeleton-actions">
              <span className="skeleton-line skeleton-line-title skeleton-pulse" />
              <span className="skeleton-line skeleton-line-title skeleton-pulse" />
            </div>
            {Array.from({ length: 4 }).map((_, index) => (
              <span key={index} className="skeleton-line skeleton-line-title skeleton-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
