'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Pencil, Search } from 'lucide-react';
import clsx from 'clsx';
import {
  buildProductsListHref,
  type AdminProductStockFilter,
} from '@/lib/admin-products';
import { imageLoaderFor } from '@/lib/cloudinary';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/types';

const STOCK_TABS: Array<{ id: AdminProductStockFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'in-stock', label: 'In stock' },
  { id: 'out-of-stock', label: 'Out of stock' },
];

interface AdminProductsManagerProps {
  products: Product[];
  initialSearch: string;
  initialStock: AdminProductStockFilter;
  total: number;
  error?: string | null;
}

export default function AdminProductsManager({
  products,
  initialSearch,
  initialStock,
  total,
  error,
}: AdminProductsManagerProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    router.push(buildProductsListHref({ search, stock: initialStock }));
  }

  return (
    <div className="admin-products">
      <div className="admin-products-toolbar">
        <form className="admin-products-search" onSubmit={handleSearchSubmit}>
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={search}
            placeholder="Search products…"
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="submit" className="admin-products-search-btn">
            Search
          </button>
        </form>

        <div className="admin-orders-source-tabs" role="tablist" aria-label="Stock filter">
          {STOCK_TABS.map((tab) => {
            const isActive = initialStock === tab.id;
            return (
              <Link
                key={tab.id}
                href={buildProductsListHref({ search: initialSearch, stock: tab.id })}
                role="tab"
                aria-selected={isActive}
                className={clsx('admin-orders-source-tab', isActive && 'is-active')}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      <p className="admin-reviews-summary">
        {total} product{total === 1 ? '' : 's'}
      </p>

      {error && (
        <div className="admin-alert admin-alert-error" role="alert">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="admin-empty-state">
          <p>No products match these filters.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table admin-products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const imageSrc = product.image || '/products/placeholder.svg';

                return (
                  <tr key={product._id}>
                    <td data-label="Product">
                      <div className="admin-product-cell">
                        <div className="admin-product-thumb">
                          <Image
                            src={imageSrc}
                            alt=""
                            fill
                            loader={imageLoaderFor(imageSrc, 'square', product.imageFit)}
                            className="object-contain p-1"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <span className="admin-product-name">{product.name}</span>
                          <span className="admin-product-slug">{product.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td data-label="SKU">{product.sku ?? '—'}</td>
                    <td data-label="Category">{product.category?.name ?? '—'}</td>
                    <td data-label="Price">{formatPrice(product.basePrice)}</td>
                    <td data-label="Stock">
                      {typeof product.stockQuantity === 'number' ? product.stockQuantity : '—'}
                    </td>
                    <td data-label="Status">
                      <span
                        className={clsx(
                          'admin-status',
                          product.inStock ? 'admin-status-responded' : 'admin-status-pending',
                        )}
                      >
                        {product.inStock ? 'In stock' : 'Out of stock'}
                      </span>
                    </td>
                    <td data-label="Featured">
                      <span
                        className={clsx(
                          'admin-status',
                          product.featured ? 'admin-status-reviewed' : 'admin-status-closed',
                        )}
                      >
                        {product.featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td data-label="Action">
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="admin-action-btn admin-action-btn-view"
                      >
                        <Pencil size={16} aria-hidden="true" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
