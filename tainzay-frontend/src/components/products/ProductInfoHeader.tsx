import StarRating from '@/components/shared/StarRating';
import type { Product } from '@/types';

interface ProductInfoHeaderProps {
  product: Product;
}

/** Title, rating, and quick meta shown above pricing */
export default function ProductInfoHeader({ product }: ProductInfoHeaderProps) {
  const rating = product.rating ?? 4.5;

  return (
    <header className="pdp-header">
      {product.category && (
        <p className="pdp-category">{product.category.name}</p>
      )}

      <h1 className="pdp-title">{product.name}</h1>

      <StarRating rating={rating} reviewCount={product.reviewCount} size="md" />

      {!product.inStock && (
        <p className="pdp-stock pdp-stock-oos">Currently out of stock</p>
      )}

      {product.sku && <p className="pdp-sku">SKU: {product.sku}</p>}
    </header>
  );
}
