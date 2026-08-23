'use client';

import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { NavMenuCategory } from '@/lib/nav-menu';

interface AllProductsMegaMenuProps {
  categories: NavMenuCategory[];
  isActive: boolean;
  vertical?: boolean;
  drawer?: boolean;
  onLinkClick?: () => void;
}

export default function AllProductsMegaMenu({
  categories,
  isActive,
  vertical = false,
  drawer = false,
  onLinkClick,
}: AllProductsMegaMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug ?? '');
  const activeCategory =
    categories.find((category) => category.slug === activeSlug) ?? categories[0];

  useEffect(() => {
    if (categories.length > 0 && !categories.some((category) => category.slug === activeSlug)) {
      setActiveSlug(categories[0].slug);
    }
  }, [categories, activeSlug]);

  if (categories.length === 0) {
    return (
      <Link
        href="/products"
        onClick={onLinkClick}
        className={
          drawer
            ? `mobile-menu-link ${isActive ? 'is-active' : ''}`
            : `category-nav-link ${isActive ? 'active' : ''} ${vertical ? 'block py-2.5' : ''}`
        }
        aria-current={isActive ? 'page' : undefined}
      >
        All Products
      </Link>
    );
  }

  if (drawer) {
    return (
      <>
        <button
          type="button"
          className={`mobile-menu-link mobile-menu-all-products-trigger ${isActive ? 'is-active' : ''}`}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span>All Products</span>
          <ChevronRight
            size={18}
            className={`mobile-menu-chevron ${open ? 'is-open' : ''}`}
            aria-hidden="true"
          />
        </button>

        {open && (
          <div className="mobile-menu-submenu">
            <Link
              href="/products"
              onClick={onLinkClick}
              className="mobile-menu-submenu-link mobile-menu-submenu-link--all"
            >
              View all products
            </Link>
            {categories.map((category) => (
              <div key={category.slug} className="mobile-menu-submenu-group">
                <Link
                  href={`/categories/${category.slug}`}
                  onClick={onLinkClick}
                  className="mobile-menu-submenu-category"
                >
                  {category.name}
                </Link>
                <ul className="mobile-menu-submenu-products">
                  {category.products.map((product) => (
                    <li key={product.slug}>
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={onLinkClick}
                        className="mobile-menu-submenu-product"
                      >
                        {product.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  if (vertical) {
    return (
      <div className="nav-mega-mobile">
        <button
          type="button"
          className={`category-nav-link nav-mega-mobile-trigger ${isActive ? 'active' : ''}`}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span>All Products</span>
          <ChevronDown
            size={16}
            className={`nav-mega-mobile-chevron ${open ? 'is-open' : ''}`}
            aria-hidden="true"
          />
        </button>

        {open && (
          <div className="nav-mega-mobile-panel">
            {categories.map((category) => (
              <div key={category.slug} className="nav-mega-mobile-group">
                <Link
                  href={`/categories/${category.slug}`}
                  onClick={onLinkClick}
                  className="nav-mega-mobile-category"
                >
                  {category.name}
                </Link>
                <ul className="nav-mega-mobile-products">
                  {category.products.map((product) => (
                    <li key={product.slug}>
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={onLinkClick}
                        className="nav-mega-mobile-product"
                      >
                        {product.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="nav-mega-item"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href="/products"
        className={`category-nav-link nav-mega-trigger ${isActive ? 'active' : ''}`}
        aria-current={isActive ? 'page' : undefined}
        aria-haspopup="true"
        aria-expanded={open}
      >
        All Products
      </Link>

      {open && (
        <div className="nav-mega-panel" role="menu" aria-label="Browse products by category">
          <div className="nav-mega-columns">
            <ul className="nav-mega-categories" role="none">
              {categories.map((category) => {
                const isHovered = category.slug === activeSlug;

                return (
                  <li key={category.slug} role="none">
                    <Link
                      href={`/categories/${category.slug}`}
                      role="menuitem"
                      className={`nav-mega-category ${isHovered ? 'is-active' : ''}`}
                      onMouseEnter={() => setActiveSlug(category.slug)}
                      onFocus={() => setActiveSlug(category.slug)}
                    >
                      <span>{category.name}</span>
                      <ChevronRight size={14} aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <ul className="nav-mega-products" role="none">
              {activeCategory?.products.map((product) => (
                <li key={product.slug} role="none">
                  <Link
                    href={`/products/${product.slug}`}
                    role="menuitem"
                    className="nav-mega-product"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
