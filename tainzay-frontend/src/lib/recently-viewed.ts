import type { Product } from '@/types';

const STORAGE_KEY = 'tainzay-recently-viewed';
const MAX_ITEMS = 8;

interface StoredProduct extends Product {
  viewedAt: number;
}

function readStorage(): StoredProduct[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as StoredProduct[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(items: StoredProduct[]) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore quota or privacy mode errors
  }
}

/** Save the current product to the recently viewed list */
export function addRecentlyViewed(product: Product) {
  const existing = readStorage().filter((item) => item.slug !== product.slug);
  const next: StoredProduct[] = [
    { ...product, viewedAt: Date.now() },
    ...existing,
  ].slice(0, MAX_ITEMS);

  writeStorage(next);
}

/** Most recent products first, optionally excluding the current page */
export function getRecentlyViewed(excludeSlug?: string): Product[] {
  return readStorage()
    .filter((item) => item.slug !== excludeSlug)
    .sort((a, b) => b.viewedAt - a.viewedAt)
    .map(({ viewedAt: _viewedAt, ...product }) => product);
}
