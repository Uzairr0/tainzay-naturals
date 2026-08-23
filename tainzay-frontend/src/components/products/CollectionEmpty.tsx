import Link from 'next/link';
import { PackageSearch } from 'lucide-react';

interface CollectionEmptyProps {
  hasFilters: boolean;
}

export default function CollectionEmpty({ hasFilters }: CollectionEmptyProps) {
  return (
    <div className="collection-empty">
      <PackageSearch className="collection-empty-icon" size={40} strokeWidth={1.5} aria-hidden="true" />
      <p className="collection-notice-title">
        {hasFilters ? 'No products match your selection' : 'No products to show yet'}
      </p>
      <p className="collection-notice-text">
        {hasFilters ? (
          <>
            Try removing a filter, widening the price range, or{' '}
            <Link href="/products" className="collection-notice-link">
              view all products
            </Link>
            .
          </>
        ) : (
          'Our catalogue is being updated. Please check back shortly, or contact us for the latest list.'
        )}
      </p>
      {hasFilters && (
        <Link href="/products" className="btn-primary-dark collection-empty-cta">
          View all products
        </Link>
      )}
    </div>
  );
}
