import type { CSSProperties } from 'react';
import { ABOUT_PAGE } from '@/lib/about-content';
import {
  cloudinaryCollectionBannerLoader,
  isCloudinaryUrl,
} from '@/lib/cloudinary';

const MOBILE_WIDTHS = [390, 480, 640, 828] as const;
const TABLET_WIDTHS = [960, 1200, 1400] as const;
const DESKTOP_WIDTHS = [1600, 1920, 2560, 3840] as const;

function heroUrl(src: string, width: number) {
  if (!isCloudinaryUrl(src)) return src;
  return cloudinaryCollectionBannerLoader({ src, width });
}

function buildSrcSet(src: string, widths: readonly number[]) {
  return widths.map((width) => `${heroUrl(src, width)} ${width}w`).join(', ');
}

export default function AboutPageHero() {
  const { hero } = ABOUT_PAGE;
  const src = hero.image;

  return (
    <section
      className="about-hero"
      aria-label="About Tainzay"
      style={{ '--about-hero-bg': hero.backgroundColor } as CSSProperties}
    >
      <h1 className="sr-only">About Tainzay</h1>
      <div className="about-hero-media">
        <picture className="about-hero-picture">
          <source
            media="(min-width: 1280px)"
            srcSet={buildSrcSet(src, DESKTOP_WIDTHS)}
            sizes="100vw"
          />
          <source
            media="(min-width: 640px)"
            srcSet={buildSrcSet(src, TABLET_WIDTHS)}
            sizes="100vw"
          />
          <img
            src={heroUrl(src, 828)}
            srcSet={buildSrcSet(src, MOBILE_WIDTHS)}
            sizes="100vw"
            alt={hero.alt}
            width={2560}
            height={853}
            fetchPriority="high"
            decoding="async"
            className="about-hero-img"
          />
        </picture>
      </div>
    </section>
  );
}
