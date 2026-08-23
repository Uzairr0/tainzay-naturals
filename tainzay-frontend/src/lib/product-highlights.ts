import type { Product } from '@/types';
import { getDescriptionBullets } from '@/lib/product-copy';

export interface ProductHighlightContent {
  benefits: string[];
  packSizeLine: string;
  sizeLabel: string;
  sizeOptions: string[];
}

function defaultBenefits(product: Product): string[] {
  const form = product.dosageForm?.toLowerCase() ?? 'formulation';

  return [
    `${product.name} is developed for reliable therapeutic use in professional healthcare settings.`,
    `The ${form} format supports convenient dosing and patient compliance.`,
    'Manufactured under quality-controlled processes with batch documentation available on request.',
    'Trusted by pharmacies, hospitals, and distributors across Pakistan.',
  ];
}

function buildPackSizeLine(product: Product): string {
  if (product.packSizeDetail) {
    return product.packSizeDetail.startsWith('Pack Size:')
      ? product.packSizeDetail
      : `Pack Size: ${product.packSizeDetail}`;
  }

  if (product.packSize && product.dosageForm) {
    return `Pack Size: ${product.dosageForm} (${product.packSize})`;
  }

  if (product.packSize) {
    return `Pack Size: ${product.packSize}`;
  }

  if (product.dosageForm) {
    return `Pack Size: ${product.dosageForm}`;
  }

  return 'Pack Size: Standard pack';
}

function buildSizeLabel(product: Product): string {
  if (product.packSizeLabel) return product.packSizeLabel;
  if (product.packSize) return product.packSize;
  if (product.dosageForm) return product.dosageForm;
  return 'Standard pack';
}

function buildSizeOptions(product: Product): string[] {
  if (product.sizeOptions && product.sizeOptions.length > 0) {
    return product.sizeOptions;
  }

  if (product.dosageForm) return [product.dosageForm];
  return ['Standard'];
}

/** Benefits + pack size block shown below pricing on the product page */
export function getProductHighlightContent(product: Product): ProductHighlightContent {
  if (
    product.benefits &&
    product.benefits.length > 0 &&
    product.packSizeDetail &&
    product.packSizeLabel &&
    product.sizeOptions &&
    product.sizeOptions.length > 0
  ) {
    return {
      benefits: product.benefits.slice(0, 4),
      packSizeLine: product.packSizeDetail.startsWith('Pack Size:')
        ? product.packSizeDetail
        : `Pack Size: ${product.packSizeDetail}`,
      sizeLabel: product.packSizeLabel,
      sizeOptions: product.sizeOptions,
    };
  }

  const fromDescription = getDescriptionBullets(product.description, 4);
  const fallback = defaultBenefits(product);
  const benefits = [...fromDescription, ...fallback].slice(0, 4);

  return {
    benefits,
    packSizeLine: buildPackSizeLine(product),
    sizeLabel: buildSizeLabel(product),
    sizeOptions: buildSizeOptions(product),
  };
}
