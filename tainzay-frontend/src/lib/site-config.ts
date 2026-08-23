export const SITE = {
  name: 'Tainzay Naturals',
  shortName: 'Tainzay',
  alternateNames: ['Tainzay', 'Tainzay Natural', 'Tainzay Naturals', 'Tainzay Naturals Pakistan'],
  tagline: 'Vitamins, Supplements & Wellness Products in Pakistan',
  logoUrl:
    'https://res.cloudinary.com/tainzay/image/upload/v1787121096/Tainzy-Highreslogo.avif',
  defaultOgImage:
    'https://res.cloudinary.com/tainzay/image/upload/v1787121096/Tainzy-Highreslogo.avif',
  about:
    'Tainzay Naturals offers quality vitamins, supplements, and wellness products across Pakistan — from immunity and pain relief to vitamins, minerals, and everyday health solutions.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  phoneDisplay: '+92 318 4263597',
  phoneTel: '+923184263597',
  email: 'guzair421@gmail.com',
  address: '123 Pharmaceutical Street, Industrial Area, Lahore, Pakistan',
  whatsappPhone: '923184263597',
  whatsappMessage: 'Hello, I am interested in Tainzay Naturals wellness products.',
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    linkedin: 'https://linkedin.com',
  },
} as const;

export const BRAND_KEYWORDS = [
  'Tainzay',
  'Tainzay Naturals',
  'Tainzay Natural',
  'Tainzay Naturals Pakistan',
  'Tainzay vitamins',
  'Tainzay supplements',
  'wellness products Pakistan',
  'buy supplements online Pakistan',
] as const;

export function getWhatsAppUrl(
  phone: string = SITE.whatsappPhone,
  message: string = SITE.whatsappMessage,
) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function getSiteUrl(path = ''): string {
  const base = SITE.url.replace(/\/$/, '');
  if (!path) return base;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
