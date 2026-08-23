export interface CollectionBanner {
  /** Wide artwork used from the `sm` breakpoint up */
  image: string;
  /** Taller crop for phones so the artwork is never cut off */
  mobileImage?: string;
  alt: string;
  /** Page background behind the banner when using object-fit: contain */
  backgroundColor?: string;
}

/** Matches the lavender in product-hero.png so letterboxing looks seamless */
export const COLLECTION_BANNER_BG = '#e8e4f2';

export const COLLECTION_BANNER: CollectionBanner = {
  image:
    'https://res.cloudinary.com/tainzay/image/upload/v1787131787/product-hero.png',
  mobileImage:
    'https://res.cloudinary.com/tainzay/image/upload/v1787131787/product-hero.png',
  alt: 'All Tainzay products — wholesale pharmaceutical catalogue',
  backgroundColor: COLLECTION_BANNER_BG,
};
