import { timingSafeEqual } from 'crypto';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE } from '@/lib/admin-auth';
import { CACHE_TAGS } from '@/lib/server-api';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

function isAdminSession(value: string | undefined): boolean {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || !value) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Storefront caches an admin save makes out of date. Closing or reopening an
 * order changes stock and availability, and review moderation changes ratings.
 */
function staleTagsAfterSave(path: string[]): string[] {
  const [resource] = path;
  if (resource === 'admin' && path[1] === 'settings') return [CACHE_TAGS.settings];
  if (resource === 'products' || resource === 'categories' || resource === 'quotes') {
    return [CACHE_TAGS.catalogue];
  }
  if (resource === 'reviews') return [CACHE_TAGS.reviews, CACHE_TAGS.catalogue];
  return [];
}

/**
 * Relays admin-panel requests from the browser to the backend. The browser only
 * has the login cookie; this checks it and adds the backend's admin secret, so
 * the secret itself never reaches the browser.
 */
async function relay(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const cookieStore = await cookies();
  if (!isAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ message: 'Admin login required.' }, { status: 401 });
  }

  const { path } = await params;
  const target = `${API_BASE}/${path.map(encodeURIComponent).join('/')}${request.nextUrl.search}`;
  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';

  const response = await fetch(target, {
    method: request.method,
    headers: {
      Authorization: `Bearer ${process.env.ADMIN_SESSION_SECRET}`,
      'Content-Type': request.headers.get('content-type') ?? 'application/json',
      Accept: 'application/json',
    },
    body: hasBody ? await request.text() : undefined,
    cache: 'no-store',
  });

  if (hasBody && response.ok) {
    for (const tag of staleTagsAfterSave(path)) {
      revalidateTag(tag, { expire: 0 });
    }
  }

  return new NextResponse(response.body, {
    status: response.status,
    headers: { 'Content-Type': response.headers.get('content-type') ?? 'application/json' },
  });
}

export { relay as GET, relay as POST, relay as PUT, relay as PATCH, relay as DELETE };
