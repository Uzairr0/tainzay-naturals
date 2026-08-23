'use client';

import { Suspense } from 'react';
import ResultSummary from '@/components/products/ResultSummary';
import SortSelect from '@/components/products/SortSelect';
import { FilterButton } from '@/components/products/FilterDrawer';
import type { PaginationMeta } from '@/types';

interface CollectionToolbarProps {
  pagination: PaginationMeta;
}

function ToolbarControls({ pagination }: CollectionToolbarProps) {
  return (
    <div className="collection-toolbar">
      <FilterButton />
      <ResultSummary pagination={pagination} />
      <SortSelect />
    </div>
  );
}

/** Sort reads the URL, so it sits in Suspense to keep the listing page static-friendly */
export default function CollectionToolbar({ pagination }: CollectionToolbarProps) {
  return (
    <Suspense
      fallback={
        <div className="collection-toolbar">
          <ResultSummary pagination={pagination} />
        </div>
      }
    >
      <ToolbarControls pagination={pagination} />
    </Suspense>
  );
}
