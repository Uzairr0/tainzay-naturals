'use client';

import { useCallback, useMemo, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  applyFilterPatch,
  clearFilters,
  filtersToHref,
  parseProductFilters,
  type ProductFilters,
} from '@/lib/product-filters';

/**
 * Client counterpart of the server-side filter parser. Reads the current URL
 * and writes patches back with `router.push`, so the back button undoes a
 * sort or filter change without jumping to the top of the page.
 */
export function useProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const filters = useMemo(
    () => parseProductFilters(searchParams),
    [searchParams],
  );

  const updateFilters = useCallback(
    (patch: Partial<ProductFilters>) => {
      const href = filtersToHref(applyFilterPatch(filters, patch), pathname);
      startTransition(() => {
        router.push(href, { scroll: false });
      });
    },
    [filters, pathname, router],
  );

  const resetFilters = useCallback(() => {
    const href = filtersToHref(clearFilters(filters), pathname);
    startTransition(() => {
      router.push(href, { scroll: false });
    });
  }, [filters, pathname, router]);

  const setFilters = useCallback(
    (next: ProductFilters) => {
      const href = filtersToHref(next, pathname);
      startTransition(() => {
        router.push(href, { scroll: false });
      });
    },
    [pathname, router],
  );

  return { filters, updateFilters, resetFilters, setFilters, isPending };
}
