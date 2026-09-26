import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import ProductInfoHeader from '@/components/products/ProductInfoHeader';
import ProductBenefitsSection from '@/components/products/ProductBenefitsSection';
import ProductPricing from '@/components/products/ProductPricing';
import ProductPurchaseExperience from '@/components/products/ProductPurchaseExperience';
import ProductAccordions from '@/components/products/ProductAccordions';
import ProductStructuredData from '@/components/products/ProductStructuredData';
import YouMayAlsoLike from '@/components/products/YouMayAlsoLike';
import RecentlyViewedOrPopular from '@/components/products/RecentlyViewedOrPopular';
import { ProductReviewsSection } from '@/components/reviews/ReviewsFeed';
import { fetchAllProductSlugs, fetchFeaturedProducts, fetchProductBySlug, fetchRelatedProducts } from '@/lib/catalogue';
import { fetchProductReviews } from '@/lib/reviews';
import { isOfferProduct } from '@/lib/product-offers';
import { getProductPricing } from '@/lib/product-pricing';
import { buildProductBreadcrumbs, buildProductMetadata } from '@/lib/product-seo';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await fetchAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: product } = await fetchProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return buildProductMetadata(product, slug);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const { data: product } = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const breadcrumbs = buildProductBreadcrumbs(product);

  const { discountPercentage } = getProductPricing(product);
  const saleBadge =
    isOfferProduct(product) && discountPercentage > 0
      ? `${discountPercentage}% OFF`
      : undefined;

  const [{ data: relatedProducts }, { data: popularProducts }, { data: productReviews }] =
    await Promise.all([
      fetchRelatedProducts(product),
      fetchFeaturedProducts(8),
      fetchProductReviews(slug, 5),
    ]);

  return (
    <>
      <ProductStructuredData product={product} slug={slug} />

      <div className="product-detail-page">
        <div className="container-wide">
          <Breadcrumb items={breadcrumbs} />

          <div className="product-detail-layout">
            <div className="product-detail-gallery">
              <ProductImageGallery
                mainImage={product.image}
                images={product.images}
                imageFit={product.imageFit}
                productName={product.name}
                saleBadge={saleBadge}
              />
            </div>

            <div className="product-detail-info">
              <ProductInfoHeader product={product} />
              <ProductPricing product={product} />
              <ProductBenefitsSection product={product} />
              <ProductPurchaseExperience product={product} />
              <ProductAccordions product={product} />
              <ProductReviewsSection
                productSlug={slug}
                productName={product.name}
                reviews={productReviews.reviews}
                totalReviews={productReviews.pagination.total}
              />
            </div>
          </div>
        </div>

        <YouMayAlsoLike products={relatedProducts} />
        <RecentlyViewedOrPopular product={product} popularProducts={popularProducts} />
      </div>
    </>
  );
}
