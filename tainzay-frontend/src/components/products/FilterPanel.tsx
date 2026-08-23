'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProductFilters } from '@/hooks/useProductFilters';
import { CATEGORY_LABELS, withFacetCounts } from '@/lib/categories';
import { formatPrice } from '@/lib/format';
import {
  applyFilterPatch,
  clearFilters,
  filtersToHref,
  hasActiveFilters,
  type ProductFilters,
  type Availability,
} from '@/lib/product-filters';
import type { ProductFacets } from '@/types';

interface FilterPanelProps {
  facets: ProductFacets;
  /** Drawer already has a title, so the sidebar heading can be skipped there */
  showHeading?: boolean;
  /** Hides the category section (useful on fixed category routes). */
  showCategoryGroup?: boolean;
  /** Optional controlled mode used by the mobile drawer's draft filters */
  controlledFilters?: ProductFilters;
  onPatch?: (patch: Partial<ProductFilters>) => void;
  onClear?: () => void;
  hideClear?: boolean;
}

function facetHref(
  pathname: string,
  filters: ReturnType<typeof useProductFilters>['filters'],
  patch: Parameters<typeof applyFilterPatch>[1],
) {
  return filtersToHref(applyFilterPatch(filters, patch), pathname);
}

function FilterPanelInner({
  facets,
  showHeading = true,
  showCategoryGroup = true,
  controlledFilters,
  onPatch,
  onClear,
  hideClear = false,
}: FilterPanelProps) {
  const pathname = usePathname();
  const { filters: liveFilters, resetFilters, updateFilters } = useProductFilters();
  const filters = controlledFilters ?? liveFilters;
  const patch = onPatch ?? updateFilters;
  const clear = onClear ?? resetFilters;
  const categories = withFacetCounts(facets.categories);
  const active = hasActiveFilters(filters);

  return (
    <div className="filter-panel">
      {showHeading && (
        <div className="filter-panel-head">
          <h2 className="filter-panel-title">Filter</h2>
          {active && !hideClear && (
            <Link
              href={filtersToHref(clearFilters(filters), pathname)}
              scroll={false}
              className="filter-clear"
              onClick={(event) => {
                event.preventDefault();
                clear();
              }}
            >
              Clear all
            </Link>
          )}
        </div>
      )}

      {showCategoryGroup && (
        <section className="filter-group" aria-labelledby="filter-categories-heading">
          <h3 id="filter-categories-heading" className="filter-group-title">
            Categories
          </h3>
          <ul className="filter-list">
            {categories.map((category) => {
              const selected = filters.category === category.slug;
              const href = facetHref(pathname, filters, {
                category: selected ? undefined : category.slug,
              });

              return (
                <li key={category.slug}>
                  <Link
                    href={href}
                    scroll={false}
                    prefetch={false}
                    className={`filter-option ${selected ? 'is-selected' : ''} ${
                      category.count === 0 && !selected ? 'is-empty' : ''
                    }`}
                    onClick={(event) => {
                      event.preventDefault();
                      patch({
                        category: selected ? undefined : category.slug,
                      });
                    }}
                  >
                    <span className="filter-option-label">
                      {CATEGORY_LABELS[category.slug] ?? category.name}
                    </span>
                    <span className="filter-option-count">({category.count})</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="filter-group" aria-labelledby="filter-availability-heading">
        <h3 id="filter-availability-heading" className="filter-group-title">
          Availability
        </h3>
        <ul className="filter-list">
          <AvailabilityOption
            value="in-stock"
            label="In stock"
            count={facets.availability.inStock}
            pathname={pathname}
            filters={filters}
            onPatch={patch}
          />
          <AvailabilityOption
            value="out-of-stock"
            label="Out of stock"
            count={facets.availability.outOfStock}
            pathname={pathname}
            filters={filters}
            onPatch={patch}
          />
        </ul>
      </section>

      <PriceFilter
        min={facets.priceRange.min}
        max={facets.priceRange.max}
        filters={filters}
        onPatch={patch}
      />
    </div>
  );
}

function AvailabilityOption({
  value,
  label,
  count,
  pathname,
  filters,
  onPatch,
}: {
  value: Availability;
  label: string;
  count: number;
  pathname: string;
  filters: ProductFilters;
  onPatch: (patch: Partial<ProductFilters>) => void;
}) {
  const selected = filters.availability === value;
  const href = facetHref(pathname, filters, {
    availability: selected ? undefined : value,
  });

  return (
    <li>
      <Link
        href={href}
        scroll={false}
        prefetch={false}
        className={`filter-option ${selected ? 'is-selected' : ''} ${
          count === 0 && !selected ? 'is-empty' : ''
        }`}
        onClick={(event) => {
          event.preventDefault();
          onPatch({ availability: selected ? undefined : value });
        }}
      >
        <span className={`filter-check ${selected ? 'is-checked' : ''}`} aria-hidden="true" />
        <span className="filter-option-label">{label}</span>
        <span className="filter-option-count">({count})</span>
      </Link>
    </li>
  );
}

function PriceFilter({
  min,
  max,
  filters,
  onPatch,
}: {
  min: number;
  max: number;
  filters: ProductFilters;
  onPatch: (patch: Partial<ProductFilters>) => void;
}) {
  const span = max - min;
  const committedLow = clamp(filters.minPrice ?? min, min, max);
  const committedHigh = clamp(filters.maxPrice ?? max, min, max);
  const [live, setLive] = useState<{ low: number; high: number } | null>(null);

  if (!Number.isFinite(min) || !Number.isFinite(max) || span < 0) return null;
  if (max <= 0 && min <= 0) return null;

  const low = live?.low ?? committedLow;
  const high = live?.high ?? committedHigh;

  const commit = (nextLow: number, nextHigh: number) => {
    const nextMin = Math.min(nextLow, nextHigh);
    const nextMax = Math.max(nextLow, nextHigh);
    setLive(null);

    const atBounds = nextMin <= min && nextMax >= max;
    if (atBounds) {
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        onPatch({ minPrice: undefined, maxPrice: undefined });
      }
      return;
    }

    if (nextMin === filters.minPrice && nextMax === filters.maxPrice) return;
    onPatch({ minPrice: nextMin, maxPrice: nextMax });
  };

  const lowPercent = span === 0 ? 0 : ((low - min) / span) * 100;
  const highPercent = span === 0 ? 100 : ((high - min) / span) * 100;

  return (
    <section className="filter-group" aria-labelledby="filter-price-heading">
      <h3 id="filter-price-heading" className="filter-group-title">
        Price
      </h3>
      {span === 0 ? (
        <p className="filter-price-values">{formatPrice(min)}</p>
      ) : (
        <>
          <div className="filter-price-slider">
            <div className="filter-price-track" aria-hidden="true">
              <div
                className="filter-price-fill"
                style={{ left: `${lowPercent}%`, right: `${100 - highPercent}%` }}
              />
            </div>
            <label className="sr-only" htmlFor="filter-price-min">
              Minimum price
            </label>
            <input
              id="filter-price-min"
              type="range"
              min={min}
              max={max}
              step={1}
              value={low}
              className="filter-price-thumb is-low"
              style={{ zIndex: low > min + span / 2 ? 4 : 3 }}
              onChange={(event) => {
                const nextLow = Math.min(Number(event.target.value), high);
                setLive({ low: nextLow, high });
              }}
              onPointerUp={(event) => {
                const nextLow = Math.min(Number((event.target as HTMLInputElement).value), high);
                commit(nextLow, high);
              }}
              onKeyUp={(event) => {
                const nextLow = Math.min(Number((event.target as HTMLInputElement).value), high);
                commit(nextLow, high);
              }}
            />
            <label className="sr-only" htmlFor="filter-price-max">
              Maximum price
            </label>
            <input
              id="filter-price-max"
              type="range"
              min={min}
              max={max}
              step={1}
              value={high}
              className="filter-price-thumb is-high"
              onChange={(event) => {
                const nextHigh = Math.max(Number(event.target.value), low);
                setLive({ low, high: nextHigh });
              }}
              onPointerUp={(event) => {
                const nextHigh = Math.max(Number((event.target as HTMLInputElement).value), low);
                commit(low, nextHigh);
              }}
              onKeyUp={(event) => {
                const nextHigh = Math.max(Number((event.target as HTMLInputElement).value), low);
                commit(low, nextHigh);
              }}
            />
          </div>
          <div className="filter-price-inputs">
            <label className="filter-price-field">
              <span>From</span>
              <input
                type="number"
                inputMode="numeric"
                min={min}
                max={high}
                value={low}
                onChange={(event) => {
                  const nextLow = clamp(Number(event.target.value) || min, min, high);
                  setLive({ low: nextLow, high });
                }}
                onBlur={() => commit(low, high)}
              />
            </label>
            <label className="filter-price-field">
              <span>To</span>
              <input
                type="number"
                inputMode="numeric"
                min={low}
                max={max}
                value={high}
                onChange={(event) => {
                  const nextHigh = clamp(Number(event.target.value) || max, low, max);
                  setLive({ low, high: nextHigh });
                }}
                onBlur={() => commit(low, high)}
              />
            </label>
          </div>
        </>
      )}
    </section>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function FilterPanel(props: FilterPanelProps) {
  return (
    <Suspense fallback={<div className="filter-panel" aria-hidden="true" />}>
      <FilterPanelInner {...props} />
    </Suspense>
  );
}
