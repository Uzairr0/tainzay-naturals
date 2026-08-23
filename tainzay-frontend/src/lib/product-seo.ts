import type { Metadata } from 'next';
import type { BreadcrumbItem } from '@/components/layout/Breadcrumb';
import { getProductDisplayPricing } from '@/lib/product-pricing';
import { buildBreadcrumbSchema, truncateDescription } from '@/lib/site-seo';
import { BRAND_KEYWORDS, getSiteUrl, SITE } from '@/lib/site-config';
import type { Product } from '@/types';

export function getProductMetaDescription(product: Product): string {
  const trimmed = product.description?.trim();
  if (trimmed) {
    return truncateDescription(
      `${trimmed} Buy ${product.name} from ${SITE.name} with delivery across Pakistan.`,
    );
  }

  const parts = [
    `Shop ${product.name} from ${SITE.name}.`,
    product.category?.name,
    product.dosageForm,
    product.packSize,
    'Order online in Pakistan.',
  ].filter(Boolean);

  return truncateDescription(parts.join(' '));
}

export function getProductKeywords(product: Product): string[] {
  const productName = product.name;

  return [
    productName,
    `${productName} Tainzay`,
    `${productName} Tainzay Naturals`,
    `buy ${productName} Pakistan`,
    `${productName} price Pakistan`,
    product.category?.name,
    product.dosageForm,
    product.manufacturer,
    ...(product.activeIngredients ?? []),
    ...BRAND_KEYWORDS,
    'Pakistan',
  ].filter((value): value is string => Boolean(value));
}

export function buildProductBreadcrumbs(product: Product): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    ...(product.category
      ? [{ label: product.category.name, href: `/categories/${product.category.slug}` }]
      : []),
    { label: product.name },
  ];
}

export function getProductCanonicalPath(slug: string): string {
  return `/products/${slug}`;
}

export function buildProductMetadata(product: Product, slug: string): Metadata {
  const description = getProductMetaDescription(product);
  const canonicalPath = getProductCanonicalPath(slug);
  const canonicalUrl = getSiteUrl(canonicalPath);
  const images = [product.image, ...(product.images ?? [])].filter(Boolean);
  const keywords = getProductKeywords(product);
  const title = `${product.name} — Buy Online in Pakistan`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      siteName: SITE.name,
      locale: 'en_PK',
      title: `${title} | ${SITE.name}`,
      description,
      images: images.map((url) => ({
        url,
        alt: `${product.name} — ${SITE.name}`,
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE.name}`,
      description,
      images: images.length > 0 ? [images[0]] : [SITE.defaultOgImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

interface ProductStructuredGraph {
  '@context': 'https://schema.org';
  '@graph': Record<string, unknown>[];
}

export function buildProductStructuredData(product: Product, slug: string): ProductStructuredGraph {
  const { salePrice } = getProductDisplayPricing(product);
  const description = getProductMetaDescription(product);
  const canonicalUrl = getSiteUrl(getProductCanonicalPath(slug));
  const images = [product.image, ...(product.images ?? [])].filter(Boolean);
  const breadcrumbs = buildProductBreadcrumbs(product);

  const productNode: Record<string, unknown> = {
    '@type': 'Product',
    name: product.name,
    description,
    image: images,
    sku: product.sku,
    url: canonicalUrl,
    category: product.category?.name,
    brand: {
      '@type': 'Brand',
      name: SITE.name,
      alternateName: [...SITE.alternateNames],
    },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'PKR',
      price: salePrice,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SITE.name,
        url: getSiteUrl('/'),
      },
    },
  };

  if (product.manufacturer && product.manufacturer !== SITE.name) {
    productNode.manufacturer = {
      '@type': 'Organization',
      name: product.manufacturer,
    };
  }

  if (product.rating && product.reviewCount) {
    productNode.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    };
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [productNode, buildBreadcrumbSchema(breadcrumbs)],
  };
}
