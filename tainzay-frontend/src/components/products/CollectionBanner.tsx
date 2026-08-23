import type { CSSProperties } from 'react';
import {
  cloudinaryCollectionBannerLoader,
  isCloudinaryUrl,
} from '@/lib/cloudinary';
import { COLLECTION_BANNER, type CollectionBanner as Banner } from '@/lib/collection-banner';

interface CollectionBannerProps {
  banner?: Banner;
}

const MOBILE_WIDTHS = [390, 480, 640, 828] as const;
const TABLET_WIDTHS = [960, 1200, 1400] as const;
const DESKTOP_WIDTHS = [1600, 1920, 2560, 3840] as const;

function bannerUrl(src: string, width: number) {
  if (!isCloudinaryUrl(src)) return src;
  return cloudinaryCollectionBannerLoader({ src, width });
}

function buildSrcSet(src: string, widths: readonly number[]) {
  return widths.map((width) => `${bannerUrl(src, width)} ${width}w`).join(', ');
}

/**
 * Static full-bleed banner at the top of a listing page. Unlike the home page
 * hero this never rotates, so it needs no client-side JavaScript.
 */
export default function CollectionBanner({ banner = COLLECTION_BANNER }: CollectionBannerProps) {
  const desktopSrc = banner.image;
  const mobileSrc = banner.mobileImage ?? banner.image;
  const backgroundColor = banner.backgroundColor ?? '#e8e4f2';

  return (
    <div
      className="collection-banner"
      style={{ '--collection-banner-bg': backgroundColor } as CSSProperties}
    >
      <div className="collection-banner-media">
        <picture className="collection-banner-picture">
          <source
            media="(min-width: 1280px)"
            srcSet={buildSrcSet(desktopSrc, DESKTOP_WIDTHS)}
            sizes="100vw"
          />
          <source
            media="(min-width: 640px)"
            srcSet={buildSrcSet(desktopSrc, TABLET_WIDTHS)}
            sizes="100vw"
          />
          <img
            src={bannerUrl(mobileSrc, 828)}
            srcSet={buildSrcSet(mobileSrc, MOBILE_WIDTHS)}
            sizes="100vw"
            alt={banner.alt}
            width={2560}
            height={640}
            fetchPriority="high"
            decoding="async"
            className="collection-banner-img"
          />
        </picture>
      </div>
    </div>
  );
}
