import type { ImageLoaderProps } from 'next/image';

export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'tainzay';

const CLOUDINARY_HOST = 'res.cloudinary.com';
const UPLOAD_SEGMENT = '/image/upload/';

export function isCloudinaryUrl(src: string): boolean {
  return src.includes(CLOUDINARY_HOST) && src.includes(UPLOAD_SEGMENT);
}

/**
 * Inserts delivery transformations directly after `/image/upload/`, so
 * Cloudinary does the resizing and format conversion on its own CDN instead of
 * the original multi-megabyte asset being downloaded or re-processed by Next.
 */
function withTransformations(src: string, transformations: string[]): string {
  return withTransformationChain(src, [transformations]);
}

/** Applies one or more transformation segments chained with `/`. */
function withTransformationChain(src: string, segments: string[][]): string {
  const index = src.indexOf(UPLOAD_SEGMENT);
  if (index === -1) return src;

  const prefix = src.slice(0, index + UPLOAD_SEGMENT.length);
  const rest = src.slice(index + UPLOAD_SEGMENT.length);
  const chain = segments.map((segment) => segment.join(',')).join('/');

  return `${prefix}${chain}/${rest}`;
}

function baseTransformations({ width, quality }: ImageLoaderProps): string[] {
  return ['f_auto', `q_${quality ?? 'auto'}`, `w_${width}`, 'c_limit'];
}

/** Resize and auto-format, preserving the original aspect ratio. */
export function cloudinaryLoader(props: ImageLoaderProps): string {
  return withTransformations(props.src, baseTransformations(props));
}

/** Shared product-on-white-square pipeline for cards and PDP. */
function cloudinaryProductSquareLoader(
  props: ImageLoaderProps,
  scaleFactor: number,
  sharpen = 70,
): string {
  const { width, quality } = props;
  const productWidth = Math.max(Math.round(width * scaleFactor), 140);

  return withTransformationChain(props.src, [
    ['e_background_removal', 'b_rgb:ffffff'],
    [`c_scale,w_${productWidth}`],
    [
      'c_pad',
      'ar_1:1',
      'b_rgb:ffffff',
      'g_center',
      `w_${width}`,
      'f_auto',
      `q_${quality ?? 'auto:good'}`,
      `e_sharpen:${sharpen}`,
      'dpr_auto',
    ],
  ]);
}

/**
 * Product cards and small thumbnails: remove studio backgrounds and pad to a
 * white square. Scaled to ~90% so packs read large in grid tiles.
 */
export function cloudinarySquareLoader(props: ImageLoaderProps): string {
  return cloudinaryProductSquareLoader(props, 0.9, 80);
}

/**
 * Product detail gallery: remove baked-in studio backgrounds, place the pack
 * on a clean white square canvas, and scale to ~74% with light sharpen.
 */
export function cloudinaryPdpLoader(props: ImageLoaderProps): string {
  return cloudinaryProductSquareLoader(props, 0.74, 65);
}

/** Collection / products page hero: sharp, full-width, natural aspect ratio. */
export function cloudinaryCollectionBannerLoader(props: ImageLoaderProps): string {
  const { width, quality } = props;

  return withTransformations(props.src, [
    'f_auto',
    `q_${quality ?? 'auto:good'}`,
    'e_sharpen:70',
    'dpr_auto',
    `w_${width}`,
    'c_scale',
  ]);
}

/** Picks the right loader, leaving local files to Next's default pipeline. */
export function imageLoaderFor(
  src: string,
  variant: 'square' | 'default' | 'pdp' | 'collection-banner' = 'default',
) {
  if (!isCloudinaryUrl(src)) return undefined;
  if (variant === 'square') return cloudinarySquareLoader;
  if (variant === 'pdp') return cloudinaryPdpLoader;
  if (variant === 'collection-banner') return cloudinaryCollectionBannerLoader;
  return cloudinaryLoader;
}
