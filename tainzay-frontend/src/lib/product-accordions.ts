import type { Product } from '@/types';
import { getDescriptionBullets } from '@/lib/product-copy';

export interface ProductFaqItem {
  question: string;
  answer: string;
}

export interface ProductAccordionPanel {
  id: string;
  title: string;
  defaultOpen?: boolean;
  paragraphs?: string[];
  bullets?: string[];
  bulletsHeading?: string;
  faqs?: ProductFaqItem[];
  meta?: { label: string; value: string }[];
}

function splitDescription(description: string): { body: string; directions: string } {
  const trimmed = description.trim();
  if (!trimmed) return { body: '', directions: '' };

  const match = trimmed.match(
    /(?:^|\n)\s*(?:PRODUCT DIRECTIONS|Directions|Usage)\s*:?\s*\n?([\s\S]*)$/i,
  );

  if (!match) {
    return { body: trimmed, directions: '' };
  }

  const body = trimmed.slice(0, match.index).trim();
  const directions = match[1]?.trim() ?? '';

  return { body, directions };
}

function buildDetailsPanel(product: Product): ProductAccordionPanel {
  const meta = [
    product.sku ? { label: 'SKU', value: product.sku } : null,
    product.packSize ? { label: 'Pack size', value: product.packSize } : null,
    product.dosageForm ? { label: 'Dosage form', value: product.dosageForm } : null,
    product.manufacturer ? { label: 'Manufacturer', value: product.manufacturer } : null,
    product.category ? { label: 'Category', value: product.category.name } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  if (product.productDetails && product.productDetails.length > 0) {
    return {
      id: 'details',
      title: 'Product Details',
      defaultOpen: true,
      bullets: product.productDetails,
      meta,
    };
  }

  const { body, directions } = splitDescription(product.description);
  const paragraphs: string[] = [];

  if (body) {
    body
      .split(/\n\s*\n/)
      .map((part) => part.trim())
      .filter(Boolean)
      .forEach((part) => paragraphs.push(part));
  }

  const directionLines = directions
    ? directions
        .split(/\n/)
        .map((line) => line.trim())
        .filter(Boolean)
    : [];

  if (paragraphs.length === 0) {
    paragraphs.push(
      'Tainzay supplies this product for pharmacies, hospitals, and wholesale distributors across Pakistan. Contact our team for batch details, certifications, and current availability.',
    );
  }

  return {
    id: 'details',
    title: 'Product Details',
    defaultOpen: true,
    paragraphs,
    bullets: directionLines.length > 0 ? directionLines : undefined,
    bulletsHeading: directionLines.length > 0 ? 'Product Directions' : undefined,
    meta,
  };
}

function buildIngredientsPanel(product: Product): ProductAccordionPanel {
  const ingredients = product.activeIngredients ?? [];
  const bullets =
    ingredients.length > 0
      ? ingredients
      : [
          'Full composition and excipient details are available on request.',
          'Contact our sales team for the latest product monograph.',
        ];

  return {
    id: 'ingredients',
    title: 'Ingredients',
    paragraphs: [
      ingredients.length > 0
        ? 'Active ingredients and composition for this product:'
        : 'Ingredient information is maintained for every Tainzay formulation.',
    ],
    bullets,
  };
}

function buildFaqsPanel(product: Product): ProductAccordionPanel {
  const productName = product.name;

  return {
    id: 'faqs',
    title: 'FAQs',
    faqs: [
      {
        question: 'How do I order this product wholesale?',
        answer:
          'Use Request Quote on this page or contact us through the quote form. Our team will confirm pricing, availability, and delivery timelines for your required quantity.',
      },
      {
        question: 'Is there a minimum order quantity?',
        answer:
          'You can select any quantity on the product page. Final pricing may vary by volume, and our team will confirm the best available rate when you request a quote.',
      },
      {
        question: `Is ${productName} currently in stock?`,
        answer: product.inStock
          ? 'This product is currently listed as in stock. Availability is confirmed when your quote is processed.'
          : 'This product is currently out of stock. Submit a quote request and our team will advise on restock timing or suitable alternatives.',
      },
      {
        question: 'Do you supply to pharmacies and hospitals?',
        answer:
          'Yes. Tainzay serves pharmacies, hospitals, clinics, and distributors with wholesale pharmaceutical products across Pakistan.',
      },
    ],
  };
}

function buildQualityPanel(): ProductAccordionPanel {
  return {
    id: 'quality',
    title: 'Our Quality Promise',
    paragraphs: [
      'Every Tainzay product is sourced and supplied with a focus on safety, consistency, and regulatory compliance for healthcare professionals.',
    ],
    bullets: [
      'Manufactured under GMP-aligned quality systems',
      'Batch traceability and documentation available on request',
      'Halal-certified options where applicable',
      'Cold-chain and storage guidance provided for sensitive formulations',
      'Dedicated support for pharmacies, hospitals, and distributors',
    ],
  };
}

export function getProductAccordionPanels(product: Product): ProductAccordionPanel[] {
  return [
    buildDetailsPanel(product),
    buildIngredientsPanel(product),
    buildFaqsPanel(product),
    buildQualityPanel(),
  ];
}
