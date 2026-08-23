'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useCallback, useEffect, useId, useRef } from 'react';
import StarRating from '@/components/shared/StarRating';
import { imageLoaderFor } from '@/lib/cloudinary';
import { formatPrice } from '@/lib/format';
import { getProductDisplayPricing } from '@/lib/product-pricing';
import { TRENDING_SEARCHES } from '@/lib/search-trends';
import type { Product } from '@/types';

interface MobileSearchDrawerProps {
  open: boolean;
  onClose: () => void;
  bestSellingProducts: Product[];
}

function SearchDrawerProductCard({
  product,
  onNavigate,
}: {
  product: Product;
  onNavigate: () => void;
}) {
  const href = `/products/${product.slug}`;
  const imageSrc = product.image || '/products/placeholder.svg';
  const pricing = getProductDisplayPricing(product);

  return (
    <Link
      href={href}
      className="search-drawer-product-card"
      onClick={onNavigate}
    >
      <div className="search-drawer-product-media">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          loader={imageLoaderFor(imageSrc, 'square')}
          className="search-drawer-product-image"
          sizes="140px"
        />
      </div>
      <h3 className="search-drawer-product-title">{product.name}</h3>
      <StarRating
        rating={product.rating ?? 4.5}
        reviewCount={product.reviewCount}
        className="search-drawer-product-rating"
      />
      <p className="search-drawer-product-price">{formatPrice(pricing.salePrice)}</p>
    </Link>
  );
}

export default function MobileSearchDrawer({
  open,
  onClose,
  bestSellingProducts,
}: MobileSearchDrawerProps) {
  const router = useRouter();
  const drawerId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const handleNavigate = useCallback(() => {
    onClose();
  }, [onClose]);

  const submitSearch = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const query = String(formData.get('search') ?? '').trim();

      onClose();

      if (query) {
        router.push(`/products?search=${encodeURIComponent(query)}`);
      } else {
        router.push('/products');
      }
    },
    [onClose, router],
  );

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 120);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="search-drawer" role="presentation">
      <button
        type="button"
        className="search-drawer-overlay"
        aria-label="Close search"
        onClick={onClose}
      />

      <div
        id={drawerId}
        className="search-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${drawerId}-title`}
      >
        <div className="search-drawer-head">
          <h2 id={`${drawerId}-title`} className="search-drawer-title">
            Search
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="search-drawer-close"
            aria-label="Close search"
            onClick={onClose}
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="search-drawer-body">
          <form role="search" action="/products" method="get" onSubmit={submitSearch}>
            <div className="search-drawer-input-wrap">
              <input
                ref={inputRef}
                type="search"
                name="search"
                aria-label="Search products"
                placeholder="Search products..."
                className="search-drawer-input"
              />
              <button
                type="submit"
                aria-label="Search"
                className="search-drawer-input-btn"
              >
                <Search size={18} strokeWidth={1.75} />
              </button>
            </div>
          </form>

          <section className="search-drawer-section" aria-labelledby={`${drawerId}-trending`}>
            <h3 id={`${drawerId}-trending`} className="search-drawer-section-title">
              Trending now
            </h3>
            <ul className="search-drawer-trends">
              {TRENDING_SEARCHES.map((term) => (
                <li key={term}>
                  <Link
                    href={`/products?search=${encodeURIComponent(term)}`}
                    className="search-drawer-trend"
                    onClick={handleNavigate}
                  >
                    <Search size={14} strokeWidth={2} aria-hidden="true" />
                    <span>{term}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {bestSellingProducts.length > 0 && (
            <section className="search-drawer-section" aria-labelledby={`${drawerId}-best-selling`}>
              <h3 id={`${drawerId}-best-selling`} className="search-drawer-section-title">
                Best selling
              </h3>
              <div className="search-drawer-products-track">
                {bestSellingProducts.map((product) => (
                  <SearchDrawerProductCard
                    key={product._id}
                    product={product}
                    onNavigate={handleNavigate}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
