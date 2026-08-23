import type { PaginationMeta } from '@/types';

interface ResultSummaryProps {
  pagination: PaginationMeta;
  className?: string;
}

/** "16 products" on a single page, "Showing 25–48 of 120 products" once paginated */
export function summariseResults({ page, limit, total }: PaginationMeta): string {
  if (total === 0) return 'No products found';
  if (total <= limit) return `${total} ${total === 1 ? 'product' : 'products'}`;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  return `Showing ${start}–${end} of ${total} products`;
}

export default function ResultSummary({ pagination, className }: ResultSummaryProps) {
  return (
    <p className={className ?? 'collection-summary'} aria-live="polite">
      {summariseResults(pagination)}
    </p>
  );
}
