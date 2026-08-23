'use client';

import { SORT_OPTIONS, type SortValue } from '@/lib/product-filters';
import { useProductFilters } from '@/hooks/useProductFilters';

export default function SortSelect() {
  const { filters, updateFilters, isPending } = useProductFilters();

  return (
    <div className="collection-sort">
      <label htmlFor="collection-sort" className="collection-sort-label">
        Sort by:
      </label>
      <select
        id="collection-sort"
        className="collection-sort-select"
        value={filters.sort}
        disabled={isPending}
        aria-busy={isPending}
        onChange={(event) => {
          updateFilters({ sort: event.target.value as SortValue });
        }}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
