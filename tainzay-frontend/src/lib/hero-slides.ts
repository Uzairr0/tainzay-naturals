export interface HeroSlide {
  id: string;
  /** Wide banner used from the `sm` breakpoint up */
  image: string;
  /** Taller crop used on phones */
  mobileImage?: string;
  alt: string;
  href?: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'family-health',
    image:
      'https://res.cloudinary.com/tainzay/image/upload/v1787124181/Family_Health-desktop.webp',
    mobileImage:
      'https://res.cloudinary.com/tainzay/image/upload/v1787123123/Family_Health-mobile.webp',
    alt: 'Fast reliable relief for your family health — doctor-trusted solutions for cough, immunity and everyday wellness',
    href: '/products',
  },
  {
    id: 't-nase',
    image:
      'https://res.cloudinary.com/tainzay/image/upload/v1787124182/T-Nase_Banner-Desktop.webp',
    mobileImage:
      'https://res.cloudinary.com/tainzay/image/upload/v1787123122/T-Nase_Banner-mobile.webp',
    alt: 'T.Nase — improves cognitive functions, mental health and inner turmoil',
    href: '/products/t-nase-drops',
  },
  {
    id: 'kof-mark',
    image:
      'https://res.cloudinary.com/tainzay/image/upload/v1787124182/Kof-Mark_Banner_Desktop.webp',
    mobileImage:
      'https://res.cloudinary.com/tainzay/image/upload/v1787123122/Kof-Mark_Banner_Mobile.webp',
    alt: 'KOF-MARK cough syrup — for the relief of dry and productive cough',
    href: '/products/kof-mark-syrup',
  },
];

export const HERO_AUTOPLAY_MS = 3000;
