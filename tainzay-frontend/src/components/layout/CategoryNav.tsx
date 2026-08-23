'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import AllProductsMegaMenu from '@/components/layout/AllProductsMegaMenu';
import type { NavMenuCategory } from '@/lib/nav-menu';
import { NAV_LINKS } from '@/lib/navigation';

function useIsActive() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.toString();
  const currentUrl = pathname + (currentQuery ? `?${currentQuery}` : '');

  return (href: string) => {
    if (href === '/') return pathname === '/';

    const [hrefPath, hrefQuery] = href.split('?');

    if (hrefQuery) {
      return pathname === hrefPath && currentQuery === hrefQuery;
    }

    if (pathname !== hrefPath && !pathname.startsWith(`${hrefPath}/`)) {
      return false;
    }

    if (pathname.startsWith(`${hrefPath}/`) && pathname !== hrefPath) {
      return true;
    }

    const matchesQueryLink = NAV_LINKS.some(
      (link) => link.href.includes('?') && currentUrl === link.href,
    );

    return !matchesQueryLink;
  };
}

interface NavLinksProps {
  vertical?: boolean;
  drawer?: boolean;
  onLinkClick?: () => void;
  menuCategories?: NavMenuCategory[];
}

export function NavLinks({
  vertical = false,
  drawer = false,
  onLinkClick,
  menuCategories = [],
}: NavLinksProps) {
  const isActive = useIsActive();

  return (
    <ul
      className={
        drawer
          ? 'mobile-menu-list'
          : vertical
            ? 'flex flex-col gap-1'
            : 'header-nav-list flex flex-wrap items-center justify-center gap-x-5 gap-y-1 xl:gap-x-8'
      }
    >
      {NAV_LINKS.map((link) => {
        const active = isActive(link.href);
        const isAllProducts = link.href === '/products';

        if (isAllProducts) {
          return (
            <li
              key={link.href}
              className={
                drawer
                  ? 'mobile-menu-item mobile-menu-item--expandable'
                  : vertical
                    ? undefined
                    : 'header-nav-item'
              }
            >
              <AllProductsMegaMenu
                categories={menuCategories}
                isActive={active}
                vertical={vertical}
                drawer={drawer}
                onLinkClick={onLinkClick}
              />
            </li>
          );
        }

        return (
          <li
            key={link.href}
            className={drawer ? 'mobile-menu-item' : vertical ? undefined : 'header-nav-item'}
          >
            <Link
              href={link.href}
              onClick={onLinkClick}
              className={
                drawer
                  ? `mobile-menu-link ${active ? 'is-active' : ''}`
                  : `category-nav-link ${active ? 'active' : ''} ${
                      vertical ? 'block py-2.5' : ''
                    }`
              }
              aria-current={active ? 'page' : undefined}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function CategoryNav({
  menuCategories = [],
}: {
  menuCategories?: NavMenuCategory[];
}) {
  return (
    <nav
      className="hidden lg:block border-t border-border-light bg-surface-white"
      aria-label="Main navigation"
    >
      <div className="container-wide">
        <div className="flex items-center justify-center py-2.5">
          <NavLinks menuCategories={menuCategories} />
        </div>
      </div>
    </nav>
  );
}
