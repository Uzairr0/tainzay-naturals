'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useProductFilters } from '@/hooks/useProductFilters';
import { applyFilterPatch, filtersToHref } from '@/lib/product-filters';
import { getVisiblePages } from '@/lib/pagination';
import type { PaginationMeta } from '@/types';

interface PaginationProps {
  pagination: PaginationMeta;
}

function PaginationControls({ pagination }: PaginationProps) {
  const pathname = usePathname();
  const { filters, updateFilters, isPending } = useProductFilters();
  const { page, totalPages } = pagination;

  if (totalPages <= 1) return null;

  const goTo = (nextPage: number) => {
    updateFilters({ page: nextPage });
    document.getElementById('collection-products')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const hrefFor = (nextPage: number) =>
    filtersToHref(applyFilterPatch(filters, { page: nextPage }), pathname);

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <nav className="pagination" aria-label="Pagination" aria-busy={isPending}>
      {prevDisabled ? (
        <span className="pagination-btn is-disabled" aria-disabled="true">
          <ChevronLeft size={16} aria-hidden="true" />
          <span>Previous</span>
        </span>
      ) : (
        <Link
          href={hrefFor(page - 1)}
          scroll={false}
          rel="prev"
          className="pagination-btn"
          aria-label="Previous page"
          onClick={(event) => {
            event.preventDefault();
            goTo(page - 1);
          }}
        >
          <ChevronLeft size={16} aria-hidden="true" />
          <span>Previous</span>
        </Link>
      )}

      <ul className="pagination-list">
        {getVisiblePages(page, totalPages).map((item, index) =>
          item === 'ellipsis' ? (
            <li key={`ellipsis-${index}`} className="pagination-ellipsis" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              {item === page ? (
                <span className="pagination-page is-current" aria-current="page">
                  {item}
                </span>
              ) : (
                <Link
                  href={hrefFor(item)}
                  scroll={false}
                  className="pagination-page"
                  aria-label={`Page ${item}`}
                  onClick={(event) => {
                    event.preventDefault();
                    goTo(item);
                  }}
                >
                  {item}
                </Link>
              )}
            </li>
          ),
        )}
      </ul>

      {nextDisabled ? (
        <span className="pagination-btn is-disabled" aria-disabled="true">
          <span>Next</span>
          <ChevronRight size={16} aria-hidden="true" />
        </span>
      ) : (
        <Link
          href={hrefFor(page + 1)}
          scroll={false}
          rel="next"
          className="pagination-btn"
          aria-label="Next page"
          onClick={(event) => {
            event.preventDefault();
            goTo(page + 1);
          }}
        >
          <span>Next</span>
          <ChevronRight size={16} aria-hidden="true" />
        </Link>
      )}
    </nav>
  );
}

export default function Pagination({ pagination }: PaginationProps) {
  return (
    <Suspense fallback={null}>
      <PaginationControls pagination={pagination} />
    </Suspense>
  );
}
