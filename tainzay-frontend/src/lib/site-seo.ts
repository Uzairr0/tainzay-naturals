import type { Metadata } from 'next';
import { BRAND_KEYWORDS, getSiteUrl, SITE } from '@/lib/site-config';

const META_DESCRIPTION_LENGTH = 160;

export function truncateDescription(text: string, max = META_DESCRIPTION_LENGTH): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trim()}…`;
}

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string;
  ogImageAlt?: string;
  noIndex?: boolean;
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  ogImage = SITE.defaultOgImage,
  ogImageAlt,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const canonicalPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = getSiteUrl(canonicalPath);
  const fullTitle = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;
  const metaDescription = truncateDescription(description);
  const mergedKeywords = [...new Set([...BRAND_KEYWORDS, ...keywords])];

  return {
    title,
    description: metaDescription,
    keywords: mergedKeywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      siteName: SITE.name,
      locale: 'en_PK',
      title: fullTitle,
      description: metaDescription,
      images: ogImage
        ? [
            {
              url: ogImage,
              alt: ogImageAlt ?? `${SITE.name} — ${title}`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDescription,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function buildOrganizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${getSiteUrl('/')}#organization`,
    name: SITE.name,
    alternateName: [...SITE.alternateNames],
    url: getSiteUrl('/'),
    logo: SITE.logoUrl,
    description: SITE.about,
    email: SITE.email,
    telephone: SITE.phoneTel,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address,
      addressCountry: 'PK',
    },
    sameAs: Object.values(SITE.social),
  };
}

export function buildWebSiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${getSiteUrl('/')}#website`,
    name: SITE.name,
    alternateName: [...SITE.alternateNames],
    url: getSiteUrl('/'),
    description: SITE.about,
    publisher: {
      '@id': `${getSiteUrl('/')}#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${getSiteUrl('/products')}?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildHomeStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [buildOrganizationSchema(), buildWebSiteSchema()],
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ label: string; href?: string }>,
) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: getSiteUrl(item.href) } : {}),
    })),
  };
}

export const HOME_METADATA = buildPageMetadata({
  title: `${SITE.name} — Vitamins, Supplements & Wellness Products`,
  description:
    'Shop Tainzay Naturals online — vitamins, supplements, pain relief, immunity support, and wellness products with delivery across Pakistan. Official Tainzay Naturals store.',
  path: '/',
  keywords: [
    'Tainzay official website',
    'Tainzay Naturals online shop',
    'vitamins Pakistan',
    'supplements Pakistan',
    'wellness store Pakistan',
  ],
});

export const PRODUCTS_LIST_METADATA = buildPageMetadata({
  title: 'All Products',
  description:
    'Browse all Tainzay Naturals products — vitamins, supplements, syrups, tablets, and wellness solutions. Find Tainzay products by category with prices in PKR.',
  path: '/products',
  keywords: [
    'Tainzay products',
    'Tainzay Naturals catalogue',
    'all Tainzay supplements',
  ],
});

export const REVIEWS_METADATA = buildPageMetadata({
  title: 'Customer Reviews',
  description:
    'Read verified customer reviews for Tainzay Naturals vitamins, supplements, and wellness products. Share your Tainzay experience.',
  path: '/reviews',
  keywords: ['Tainzay reviews', 'Tainzay Naturals reviews', 'customer reviews'],
});

export const CONTACT_METADATA = buildPageMetadata({
  title: 'Contact Us',
  description:
    'Contact Tainzay Naturals for product inquiries, wholesale quotes, and support. Reach our team by phone, email, or WhatsApp in Pakistan.',
  path: '/contact',
  keywords: ['contact Tainzay', 'Tainzay Naturals contact', 'Tainzay support'],
});

export const CONCERN_METADATA = buildPageMetadata({
  title: 'Know Your Concern',
  description:
    'Find the right Tainzay Naturals product for your health concern. Personalized wellness recommendations for vitamins, supplements, and everyday care.',
  path: '/know-your-concern',
  keywords: ['Tainzay product finder', 'wellness recommendation', 'health concern'],
});

export const CART_METADATA = buildPageMetadata({
  title: 'Your Cart',
  description: 'Review items in your Tainzay Naturals cart and proceed to checkout.',
  path: '/cart',
  noIndex: true,
});

export const CHECKOUT_METADATA = buildPageMetadata({
  title: 'Checkout',
  description: 'Complete your Tainzay Naturals order with contact, delivery, and payment details.',
  path: '/checkout',
  noIndex: true,
});

export function buildCategoryMetadata(categoryName: string, slug: string) {
  return buildPageMetadata({
    title: `${categoryName} Products`,
    description: `Shop ${categoryName.toLowerCase()} products from Tainzay Naturals. Browse vitamins, supplements, and wellness solutions in ${categoryName} with prices in PKR.`,
    path: `/categories/${slug}`,
    keywords: [
      `Tainzay ${categoryName}`,
      `${categoryName} supplements Pakistan`,
      `Tainzay Naturals ${categoryName}`,
    ],
  });
}
