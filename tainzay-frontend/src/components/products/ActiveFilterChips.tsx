'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useProductFilters } from '@/hooks/useProductFilters';
import { CATEGORY_LABELS } from '@/lib/categories';
import {
  clearFilters,
  filtersToHref,
  getFilterChips,
} from '@/lib/product-filters';

function Chips() {
  const pathname = usePathname();
  const { filters, updateFilters, resetFilters } = useProductFilters();
  const chips = getFilterChips(filters, CATEGORY_LABELS);

  if (chips.length === 0) return null;

  return (
    <div className="filter-chips">
      <ul className="filter-chips-list">
        {chips.map((chip) => (
          <li key={chip.key}>
            <button
              type="button"
              className="filter-chip"
              aria-label={`Remove filter ${chip.label}`}
              onClick={() => updateFilters(chip.patch)}
            >
              <span>{chip.label}</span>
              <X size={12} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
      <Link
        href={filtersToHref(clearFilters(filters), pathname)}
        scroll={false}
        className="filter-clear"
        onClick={(event) => {
          event.preventDefault();
          resetFilters();
        }}
      >
        Clear all
      </Link>
    </div>
  );
}

export default function ActiveFilterChips() {
  return (
    <Suspense fallback={null}>
      <Chips />
    </Suspense>
  );
}
