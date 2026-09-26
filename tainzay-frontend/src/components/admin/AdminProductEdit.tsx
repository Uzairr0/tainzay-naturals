'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { productsApi } from '@/lib/api';
import { imageLoaderFor } from '@/lib/cloudinary';
import { formatPrice } from '@/lib/format';
import type { AdminProductUpdate, Product } from '@/types';

interface AdminProductEditProps {
  product: Product;
}

export default function AdminProductEdit({ product: initialProduct }: AdminProductEditProps) {
  const router = useRouter();
  const [product] = useState(initialProduct);
  const [basePrice, setBasePrice] = useState(String(product.basePrice));
  const [stockQuantity, setStockQuantity] = useState(
    typeof product.stockQuantity === 'number' ? String(product.stockQuantity) : '0',
  );
  const [inStock, setInStock] = useState(product.inStock);
  const [featured, setFeatured] = useState(product.featured);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaveError('');
    setSaveSuccess('');

    const parsedPrice = Number.parseFloat(basePrice);
    const parsedStock = Number.parseInt(stockQuantity, 10);

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setSaveError('Enter a valid price.');
      return;
    }

    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      setSaveError('Enter a valid stock quantity.');
      return;
    }

    const payload: AdminProductUpdate = {
      basePrice: parsedPrice,
      inStock,
      stockQuantity: parsedStock,
      featured,
    };

    setIsSaving(true);

    try {
      await productsApi.update(product._id, payload);
      setSaveSuccess('Product updated successfully.');
      router.refresh();
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update product.';
      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  }

  const imageSrc = product.image || '/products/placeholder.svg';

  return (
    <div className="admin-product-edit">
      <Link href="/admin/products" className="admin-back-link">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to products
      </Link>

      <section className="admin-product-edit-head">
        <div className="admin-product-edit-preview">
          <div className="admin-product-edit-image">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              loader={imageLoaderFor(imageSrc, 'square', product.imageFit)}
              className="object-contain p-2"
              sizes="96px"
            />
          </div>
          <div>
            <p className="admin-order-detail-eyebrow">Edit product</p>
            <h2 className="admin-order-detail-title">{product.name}</h2>
            <div className="admin-product-edit-meta">
              <span>{product.category?.name}</span>
              {product.sku && <span>SKU: {product.sku}</span>}
              <Link
                href={`/products/${product.slug}`}
                className="admin-review-product-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on site
                <ExternalLink size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <form className="admin-product-edit-form admin-detail-card" onSubmit={handleSubmit}>
        <h3 className="admin-detail-card-title">Catalogue settings</h3>

        <div className="admin-product-edit-grid">
          <label className="admin-order-status-field" htmlFor="product-price">
            <span className="admin-form-label">Base price (PKR)</span>
            <input
              id="product-price"
              type="number"
              min="0"
              step="1"
              className="admin-form-input"
              value={basePrice}
              disabled={isSaving}
              onChange={(event) => setBasePrice(event.target.value)}
            />
          </label>

          <label className="admin-order-status-field" htmlFor="product-stock">
            <span className="admin-form-label">Stock quantity</span>
            <input
              id="product-stock"
              type="number"
              min="0"
              step="1"
              className="admin-form-input"
              value={stockQuantity}
              disabled={isSaving}
              onChange={(event) => setStockQuantity(event.target.value)}
            />
          </label>

          <label className="admin-product-checkbox">
            <input
              type="checkbox"
              checked={inStock}
              disabled={isSaving}
              onChange={(event) => setInStock(event.target.checked)}
            />
            <span>In stock (available to buy)</span>
          </label>

          <label className="admin-product-checkbox">
            <input
              type="checkbox"
              checked={featured}
              disabled={isSaving}
              onChange={(event) => setFeatured(event.target.checked)}
            />
            <span>Featured on homepage</span>
          </label>
        </div>

        {saveError && (
          <div className="admin-alert admin-alert-error" role="alert">
            {saveError}
          </div>
        )}

        {saveSuccess && (
          <div className="admin-alert admin-alert-success" role="status">
            {saveSuccess}
          </div>
        )}

        <div className="admin-product-edit-actions">
          <button type="submit" className="admin-action-btn admin-action-btn-approve" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save changes'}
          </button>
          <p className="admin-product-edit-note">
            Current price on site: {formatPrice(product.basePrice)}
          </p>
        </div>
      </form>
    </div>
  );
}
