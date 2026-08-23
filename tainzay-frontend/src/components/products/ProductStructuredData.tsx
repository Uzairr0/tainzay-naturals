import {
  buildProductStructuredData,
  getProductCanonicalPath,
} from '@/lib/product-seo';
import type { Product } from '@/types';

interface ProductStructuredDataProps {
  product: Product;
  slug: string;
}

export default function ProductStructuredData({ product, slug }: ProductStructuredDataProps) {
  const structuredData = buildProductStructuredData(product, slug);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
