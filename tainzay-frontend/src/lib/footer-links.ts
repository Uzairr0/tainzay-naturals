import type { NavLink } from '@/lib/navigation';

export const FOOTER_INFORMATION: NavLink[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
];

export const FOOTER_SHOP: NavLink[] = [
  { label: 'All Products', href: '/products' },
  { label: 'Discount & Offers', href: '/products?filter=offers' },
  { label: 'New Arrivals', href: '/products?filter=new-arrivals' },
  { label: 'Best Selling', href: '/products?filter=best-selling' },
];

export const FOOTER_USEFUL: NavLink[] = [
  { label: 'Blog', href: '/blog' },
  { label: 'Request a Quote', href: '/contact' },
  { label: 'Categories', href: '/products' },
  { label: 'FAQs', href: '/faqs' },
];
