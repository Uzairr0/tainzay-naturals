import type { MetadataRoute } from 'next';
import { HOME_CATEGORIES } from '@/lib/categories';
import { fetchAllProductSlugs } from '@/lib/catalogue';
import { getSiteUrl } from '@/lib/site-config';

const STATIC_PAGES: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
}> = [
  { path: '/', priority: 1, changeFrequency: 'daily' },
  { path: '/products', priority: 0.9, changeFrequency: 'daily' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/reviews', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/know-your-concern', priority: 0.6, changeFrequency: 'monthly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(
    ({ path, priority, changeFrequency }) => ({
      url: getSiteUrl(path),
      lastModified,
      changeFrequency,
      priority,
    }),
  );

  const categoryEntries: MetadataRoute.Sitemap = HOME_CATEGORIES.map((category) => ({
    url: getSiteUrl(`/categories/${category.slug}`),
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  const slugs = await fetchAllProductSlugs();
  const productEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: getSiteUrl(`/products/${slug}`),
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries];
}

export const revalidate = 3600;
