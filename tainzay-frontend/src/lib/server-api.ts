import { cache } from 'react';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(
  /\/$/,
  '',
);

/** Seconds to keep catalogue responses in the Next.js data cache. */
export const REVALIDATE = {
  catalogue: 60,
  settings: 300,
  reviews: 120,
} as const;

export class ServerApiError extends Error {
  status: number;

  path: string;

  constructor(status: number, path: string) {
    super(`API ${status}: ${path}`);
    this.status = status;
    this.path = path;
  }
}

function buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
  const url = new URL(`${API_BASE}${path.startsWith('/') ? path : `/${path}`}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

/** Cache tags, so admin saves can refresh the matching storefront data at once. */
export const CACHE_TAGS = {
  settings: 'site-settings',
  catalogue: 'catalogue',
  reviews: 'reviews',
} as const;

function cacheTagsFor(path: string): string[] {
  if (path.startsWith('/settings')) return [CACHE_TAGS.settings];
  if (path.startsWith('/products') || path.startsWith('/categories')) return [CACHE_TAGS.catalogue];
  if (path.startsWith('/reviews')) return [CACHE_TAGS.reviews];
  return [];
}

async function fetchServerJson<T>(
  path: string,
  revalidateSeconds: number,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const response = await fetch(buildUrl(path, params), {
    next: { revalidate: revalidateSeconds, tags: cacheTagsFor(path) },
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new ServerApiError(response.status, path);
  }

  return response.json() as Promise<T>;
}

/** Dedupes identical API reads within one server render (metadata + page, etc.). */
export const fetchServerJsonCached = cache(fetchServerJson);

export function toQueryRecord(
  params: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | undefined> {
  const record: Record<string, string | number | undefined> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') continue;
    record[key] = typeof value === 'boolean' ? String(value) : value;
  }

  return record;
}
