export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'All Products', href: '/products' },
  { label: 'Discount & Offers', href: '/products?filter=offers' },
  { label: 'New Arrivals', href: '/products?filter=new-arrivals' },
  { label: 'Best Selling', href: '/products?filter=best-selling' },
  // { label: 'Blog', href: '/blog' },
  { label: 'About Us', href: '/about' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Contact Us', href: '/contact' },
];
