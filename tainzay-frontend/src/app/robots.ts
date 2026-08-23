import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/cart', '/checkout'],
    },
    sitemap: getSiteUrl('/sitemap.xml'),
    host: getSiteUrl('/'),
  };
}
