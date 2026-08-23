'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { applyFilterPatch, filtersToHref, parseProductFilters } from '@/lib/product-filters';

/** Drops a typed-in page number that overshoots the last page, without a new history entry */
function SyncPageParamInner({ page }: { page: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const current = parseProductFilters(searchParams).page;
    if (current === page) return;
    router.replace(
      filtersToHref(applyFilterPatch(parseProductFilters(searchParams), { page }), pathname),
      { scroll: false },
    );
  }, [page, pathname, router, searchParams]);

  return null;
}

export default function SyncPageParam({ page }: { page: number }) {
  return (
    <Suspense fallback={null}>
      <SyncPageParamInner page={page} />
    </Suspense>
  );
}
