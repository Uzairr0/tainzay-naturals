'use client';

import { useMemo, useState } from 'react';
import FilterPanel from '@/components/products/FilterPanel';
import { useFilterDrawer } from '@/components/products/FilterDrawer';
import { useProductFilters } from '@/hooks/useProductFilters';
import {
  applyFilterPatch,
  clearFilters,
  filtersToSearchParams,
  type ProductFilters,
} from '@/lib/product-filters';
import type { ProductFacets } from '@/types';

interface MobileFilterDrawerContentProps {
  facets: ProductFacets;
  showCategoryGroup?: boolean;
}

function equalFilters(a: ProductFilters, b: ProductFilters) {
  return filtersToSearchParams(a).toString() === filtersToSearchParams(b).toString();
}

/**
 * Mobile drawer uses a draft copy of filters so users can tweak multiple
 * controls and commit once with Apply.
 */
export default function MobileFilterDrawerContent({
  facets,
  showCategoryGroup = true,
}: MobileFilterDrawerContentProps) {
  const { setOpen, openCount } = useFilterDrawer();
  return (
    <DraftSheet
      key={openCount}
      facets={facets}
      showCategoryGroup={showCategoryGroup}
      onClose={() => setOpen(false)}
    />
  );
}

function DraftSheet({
  facets,
  showCategoryGroup,
  onClose,
}: {
  facets: ProductFacets;
  showCategoryGroup: boolean;
  onClose: () => void;
}) {
  const { filters, setFilters } = useProductFilters();
  const [draft, setDraft] = useState<ProductFilters>(filters);

  const changed = useMemo(() => !equalFilters(draft, filters), [draft, filters]);

  return (
    <div className="mobile-filter-sheet">
      <FilterPanel
        facets={facets}
        showHeading={false}
        showCategoryGroup={showCategoryGroup}
        hideClear
        controlledFilters={draft}
        onPatch={(patch) => setDraft((prev) => applyFilterPatch(prev, patch))}
        onClear={() => setDraft((prev) => clearFilters(prev))}
      />

      <div className="mobile-filter-actions">
        <button
          type="button"
          className="mobile-filter-clear"
          onClick={() => setDraft((prev) => clearFilters(prev))}
        >
          Clear
        </button>
        <button
          type="button"
          className="btn-primary-dark mobile-filter-apply"
          disabled={!changed}
          onClick={() => {
            if (changed) {
              setFilters(draft);
            }
            onClose();
          }}
        >
          Apply filters
        </button>
      </div>
    </div>
  );
}
