import type { Metadata } from 'next';
import { ABOUT_PAGE } from '@/lib/about-content';
import {
  buildBreadcrumbSchema,
  buildOrganizationSchema,
  buildPageMetadata,
  buildWebSiteSchema,
} from '@/lib/site-seo';
import { getSiteUrl } from '@/lib/site-config';

const ABOUT_CANONICAL_PATH = '/about';

const ABOUT_OG_IMAGE =
  'https://res.cloudinary.com/tainzay/image/upload/v1787383949/About-Us-hero.png';

export function buildAboutMetadata(): Metadata {
  return buildPageMetadata({
    title: 'About Us',
    description:
      'Learn about Tainzay Naturals — a wellness brand offering vitamins, supplements, and health products across Pakistan. A project of Tainzy International.',
    path: ABOUT_CANONICAL_PATH,
    keywords: [
      'about Tainzay Naturals',
      'Tainzay company',
      'Tainzay wellness brand',
      'Tainzay Pakistan',
    ],
    ogImage: ABOUT_OG_IMAGE,
    ogImageAlt: 'About Tainzay Naturals wellness products',
  });
}

export function buildAboutStructuredData() {
  const canonicalUrl = getSiteUrl(ABOUT_CANONICAL_PATH);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationSchema(),
      buildWebSiteSchema(),
      {
        '@type': 'AboutPage',
        '@id': `${canonicalUrl}#about`,
        url: canonicalUrl,
        name: `About ${ABOUT_PAGE.meta.title}`,
        description: ABOUT_PAGE.meta.description,
        isPartOf: {
          '@id': `${getSiteUrl('/')}#website`,
        },
        about: {
          '@id': `${getSiteUrl('/')}#organization`,
        },
      },
      buildBreadcrumbSchema([
        { label: 'Home', href: '/' },
        { label: 'About Us' },
      ]),
    ],
  };
}
