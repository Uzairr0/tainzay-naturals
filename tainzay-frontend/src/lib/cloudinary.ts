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

/**
 * Shared product-on-white-square pipeline for cards and PDP. Studio shots are
 * tall frames with a small pack in the middle, so after removing the backdrop
 * the empty space is trimmed away; the pack is then fitted into `fill` of the
 * square and `c_mpad` adds the white margin without scaling it back up.
 */
function cloudinaryProductSquareLoader(
  props: ImageLoaderProps,
  fill: number,
  sharpen: number,
): string {
  const { width, quality } = props;
  const productWidth = Math.round(width * fill);

  return withTransformationChain(props.src, [
    ['e_background_removal'],
    ['e_trim'],
    ['c_pad', 'ar_1:1', 'b_rgb:ffffff', 'g_center', `w_${productWidth}`],
    ['c_mpad', `w_${width}`, `h_${width}`, 'b_rgb:ffffff', 'g_center'],
    ['f_auto', `q_${quality ?? 'auto:good'}`, `e_sharpen:${sharpen}`],
  ]);
}

/** Product cards and small thumbnails: pack fills ~86% of the white square. */
export function cloudinarySquareLoader(props: ImageLoaderProps): string {
  return cloudinaryProductSquareLoader(props, 0.86, 60);
}

/** Product detail gallery: slightly more breathing room around the pack. */
export function cloudinaryPdpLoader(props: ImageLoaderProps): string {
  return cloudinaryProductSquareLoader(props, 0.8, 50);
}

/**
 * Finished lifestyle photos (product styled in a scene): keep the scene and
 * crop to a full-bleed square, since background removal would strip it.
 */
export function cloudinaryPhotoSquareLoader(props: ImageLoaderProps): string {
  const { width, quality } = props;

  return withTransformations(props.src, [
    'c_fill',
    'ar_1:1',
    'g_auto',
    `w_${width}`,
    'f_auto',
    `q_${quality ?? 'auto:good'}`,
  ]);
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

/**
 * How a product photo is framed: `cutout` removes the studio background and
 * pads the pack onto white; `cover` shows a styled photo as-is, cropped square.
 */
export type ProductImageFit = 'cutout' | 'cover';

/** Picks the right loader, leaving local files to Next's default pipeline. */
export function imageLoaderFor(
  src: string,
  variant: 'square' | 'default' | 'pdp' | 'collection-banner' = 'default',
  fit: ProductImageFit = 'cutout',
) {
  if (!isCloudinaryUrl(src)) return undefined;
  if (fit === 'cover' && (variant === 'square' || variant === 'pdp')) {
    return cloudinaryPhotoSquareLoader;
  }
  if (variant === 'square') return cloudinarySquareLoader;
  if (variant === 'pdp') return cloudinaryPdpLoader;
  if (variant === 'collection-banner') return cloudinaryCollectionBannerLoader;
  return cloudinaryLoader;
}
