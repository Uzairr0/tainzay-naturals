import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { BRAND_KEYWORDS, getSiteUrl, SITE } from '@/lib/site-config';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const defaultDescription =
  'Shop Tainzay Naturals online — vitamins, supplements, pain relief, immunity support, and wellness products with delivery across Pakistan.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Vitamins, Supplements & Wellness Products in Pakistan`,
    template: `%s | ${SITE.name}`,
  },
  description: defaultDescription,
  keywords: [...BRAND_KEYWORDS],
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: getSiteUrl('/') }],
  creator: SITE.name,
  publisher: SITE.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: getSiteUrl('/'),
    siteName: SITE.name,
    locale: 'en_PK',
    title: `${SITE.name} — Vitamins, Supplements & Wellness Products`,
    description: defaultDescription,
    images: [
      {
        url: SITE.defaultOgImage,
        alt: `${SITE.name} logo`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — Vitamins, Supplements & Wellness Products`,
    description: defaultDescription,
    images: [SITE.defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-PK" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
