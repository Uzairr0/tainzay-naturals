'use client';

import Link from 'next/link';
import { Menu, Search, ShoppingCart, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { getWhatsAppUrl } from '@/lib/site-config';
import MobileMenuDrawer from '@/components/layout/MobileMenuDrawer';
import MobileSearchDrawer from '@/components/layout/MobileSearchDrawer';
import { NavLinks } from '@/components/layout/CategoryNav';
import SiteLogo from '@/components/layout/SiteLogo';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import type { NavMenuCategory } from '@/lib/nav-menu';
import type { Product } from '@/types';

function SearchBar({ className = '' }: { className?: string }) {
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get('search') ?? '';

  return (
    <form
      className={`relative w-full ${className}`}
      role="search"
      action="/products"
      method="get"
    >
      <input
        key={currentSearch}
        type="search"
        name="search"
        defaultValue={currentSearch}
        aria-label="Search the catalogue"
        placeholder="Search the store"
        className="header-search-input"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-primary hover:text-brand-primary transition-colors"
      >
        <Search size={18} strokeWidth={1.75} />
      </button>
    </form>
  );
}

function CartButton({
  cartCount,
  showLabel = true,
}: {
  cartCount: number;
  showLabel?: boolean;
}) {
  return (
    <Link
      href="/cart"
      className="flex flex-col items-center group"
      aria-label={`Cart, ${cartCount} items`}
    >
      <div className="relative flex items-center">
        <ShoppingCart
          size={showLabel ? 24 : 22}
          strokeWidth={1.6}
          className="text-text-primary group-hover:text-brand-primary transition-colors"
        />
        {cartCount > 0 && <span className="header-cart-badge">{cartCount}</span>}
      </div>
      {showLabel && (
        <span className="text-xs text-text-primary mt-0.5">Cart</span>
      )}
    </Link>
  );
}

export default function Header({
  menuCategories = [],
  bestSellingProducts = [],
}: {
  menuCategories?: NavMenuCategory[];
  bestSellingProducts?: Product[];
}) {
  const { count: cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [stickySearchOpen, setStickySearchOpen] = useState(false);
  const topRowRef = useRef<HTMLDivElement>(null);
  const whatsappUrl = getWhatsAppUrl();

  useEffect(() => {
    const topRow = topRowRef.current;
    if (!topRow) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!entry.isIntersecting);
      },
      {
        // Trigger when the main header row leaves the viewport top
        root: null,
        threshold: 0,
        rootMargin: '-1px 0px 0px 0px',
      },
    );

    observer.observe(topRow);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!scrolled) setStickySearchOpen(false);
  }, [scrolled]);

  const openMobileMenu = () => {
    setMobileSearchOpen(false);
    setMobileMenuOpen(true);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const openMobileSearch = () => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(true);
  };

  const closeMobileSearch = () => setMobileSearchOpen(false);

  return (
    <>
      {/* ── Mobile header (always sticky) ── */}
      <header className="sticky top-0 z-50 bg-surface-white border-b border-border-light lg:hidden">
        <div className="flex items-center justify-between gap-2 px-4 h-14">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={openMobileMenu}
              className="p-1.5 text-text-primary hover:text-brand-primary transition-colors"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              <Menu size={22} />
            </button>

            <button
              type="button"
              onClick={openMobileSearch}
              className="p-1.5 text-text-primary hover:text-brand-primary transition-colors"
              aria-label="Open search"
              aria-expanded={mobileSearchOpen}
            >
              <Search size={22} strokeWidth={1.75} />
            </button>
          </div>

          <div className="flex-1 flex justify-center items-center min-w-0">
            <SiteLogo variant="compact" />
          </div>

          <div className="flex items-center gap-0.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-whatsapp hover:text-whatsapp-hover transition-colors"
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5" />
            </a>
            <Link
              href="/cart"
              className="relative p-1.5 text-text-primary hover:text-brand-primary transition-colors"
              aria-label={`Cart, ${cartCount} items`}
            >
              <ShoppingCart size={20} strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-brand-primary text-text-inverse text-[10px] font-semibold rounded-full flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <MobileMenuDrawer
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
        menuCategories={menuCategories}
      />

      <MobileSearchDrawer
        open={mobileSearchOpen}
        onClose={closeMobileSearch}
        bestSellingProducts={bestSellingProducts}
      />

      {/* ── Desktop header ── */}
      <div className="hidden lg:block">
        {/* Top row scrolls away normally */}
        <div
          ref={topRowRef}
          className="bg-surface-white border-b border-border-light"
        >
          <div className="container-wide">
            <div className="header-desktop-row">
              <div className="header-desktop-logo">
                <SiteLogo />
              </div>

              <div className="header-desktop-search">
                <div className="header-desktop-search-inner">
                  <SearchBar />
                </div>
              </div>

              <div className="header-desktop-actions">
                <CartButton cartCount={cartCount} showLabel />

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group"
                  aria-label="Chat on WhatsApp"
                >
                  <div className="w-8 h-8 rounded-full bg-whatsapp/10 flex items-center justify-center flex-shrink-0 group-hover:bg-whatsapp/20 transition-colors">
                    <WhatsAppIcon className="w-[18px] h-[18px] text-whatsapp" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs text-text-secondary">Need help?</span>
                    <span className="text-sm font-bold text-text-primary">WhatsApp</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Default nav — scrolls with page */}
        <div className="bg-surface-white border-b border-border-light header-main-nav">
          <div className="container-wide">
            <div className="header-sticky-inner">
              <nav className="header-sticky-links" aria-label="Main navigation">
                <NavLinks menuCategories={menuCategories} />
              </nav>
            </div>
          </div>
        </div>

        {/* Fixed compact header — stays until user returns to top */}
        {scrolled && (
          <div className="header-fixed-compact" role="banner">
            <div className="container-wide">
              <div className="header-sticky-inner is-scrolled">
                <div className="header-sticky-logo is-visible">
                  <SiteLogo variant="sticky" />
                </div>

                <nav className="header-sticky-links" aria-label="Main navigation">
                  <NavLinks menuCategories={menuCategories} />
                </nav>

                <div className="header-sticky-actions is-visible">
                  <button
                    type="button"
                    className="p-1.5 text-text-primary hover:text-brand-primary transition-colors"
                    aria-label={stickySearchOpen ? 'Close search' : 'Open search'}
                    aria-expanded={stickySearchOpen}
                    onClick={() => setStickySearchOpen((open) => !open)}
                  >
                    {stickySearchOpen ? (
                      <X size={20} strokeWidth={1.75} />
                    ) : (
                      <Search size={20} strokeWidth={1.75} />
                    )}
                  </button>
                  <CartButton cartCount={cartCount} showLabel={false} />
                </div>
              </div>

              {stickySearchOpen && (
                <div className="header-sticky-search pb-3">
                  <SearchBar />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
