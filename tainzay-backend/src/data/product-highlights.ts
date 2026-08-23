export interface ProductHighlightSeed {
  benefits: string[];
  packSizeDetail: string;
  packSizeLabel: string;
  sizeOptions: string[];
}

/** Product page benefits and pack size copy, keyed by slug */
export const PRODUCT_HIGHLIGHTS: Record<string, ProductHighlightSeed> = {
  'kd-3-capsules': {
    benefits: [
      'Supports strong and healthy bones by helping the body absorb calcium effectively.',
      'Helps maintain normal muscle function and overall physical strength.',
      'Supports a healthy immune system and normal body functions.',
      'Helps maintain adequate Vitamin D levels in the body.',
    ],
    packSizeDetail: 'Pack Size: Vitamin D3 (200,000 IU) — Capsules',
    packSizeLabel: 'Capsules',
    sizeOptions: ['Vitamin D3 (200,000 IU)'],
  },
  'kof-mark-syrup': {
    benefits: [
      'Helps provide soothing support for cough and throat discomfort.',
      'Supports comfortable breathing during cough-related irritation.',
      'Helps ease throat irritation and dryness.',
      'Convenient liquid formulation for easy intake.',
    ],
    packSizeDetail: 'Pack Size: 120 ml Syrup',
    packSizeLabel: '120 ml Syrup',
    sizeOptions: ['120 ml'],
  },
  'medical-tablets': {
    benefits: [
      'Supports overall health and daily nutritional needs.',
      'Helps provide essential nutritional support for the body.',
      'Supports normal energy levels and general wellbeing.',
      'Convenient tablet formulation for regular supplementation.',
    ],
    packSizeDetail: 'Pack Size: 30 Tablets',
    packSizeLabel: '30 Tablets',
    sizeOptions: ['30 Tablets'],
  },
  'medigin-syrup': {
    benefits: [
      'Supports mental focus and cognitive performance.',
      'Helps support memory and concentration in daily activities.',
      'Provides nutritional support for overall brain function.',
      'Easy-to-take liquid formulation for convenient supplementation.',
    ],
    packSizeDetail: 'Pack Size: 120 ml Syrup',
    packSizeLabel: '120 ml Syrup',
    sizeOptions: ['120 ml'],
  },
  'medplexin-syrup': {
    benefits: [
      'Supports daily nutritional needs and overall wellbeing.',
      'Helps provide essential nutritional support for the body.',
      'Supports healthy energy levels and physical vitality.',
      'Easy-to-take liquid formulation for convenient use.',
    ],
    packSizeDetail: 'Pack Size: 120 ml Syrup',
    packSizeLabel: '120 ml Syrup',
    sizeOptions: ['120 ml'],
  },
  'mg-vit-d-tablets': {
    benefits: [
      'Supports healthy bones and teeth through essential mineral and Vitamin D support.',
      'Helps support normal muscle function and relaxation.',
      'Supports a healthy nervous system and overall wellbeing.',
      'Helps the body maintain proper mineral balance.',
    ],
    packSizeDetail: 'Pack Size: 30 Tablets',
    packSizeLabel: '30 Tablets',
    sizeOptions: ['30 Tablets'],
  },
  'mullet-syrup': {
    benefits: [
      'Provides comprehensive nutritional support for everyday wellness.',
      'Helps support healthy energy levels and physical vitality.',
      "Supports the body's daily vitamin and mineral requirements.",
      'Easy-to-take liquid formulation suitable for convenient supplementation.',
    ],
    packSizeDetail: 'Pack Size: 120 ml Syrup',
    packSizeLabel: '120 ml Syrup',
    sizeOptions: ['120 ml'],
  },
  'mullet-tablets': {
    benefits: [
      'Provides comprehensive nutritional support for everyday wellness.',
      'Helps support healthy energy levels and physical vitality.',
      "Supports the body's daily vitamin and mineral requirements.",
      'Convenient tablet formulation for regular supplementation.',
    ],
    packSizeDetail: "Pack Size: 10 × 20's Tablets (200 Tablets)",
    packSizeLabel: "10 × 20's Tablets (200 Tablets)",
    sizeOptions: ["10 × 20's"],
  },
  'murex-syrup': {
    benefits: [
      'Supports mental focus, concentration, and cognitive performance.',
      'Helps support healthy brain function and mental alertness.',
      'Provides nutritional support for everyday mental performance.',
      'Easy-to-take liquid formulation for convenient supplementation.',
    ],
    packSizeDetail: 'Pack Size: 120 ml Syrup',
    packSizeLabel: '120 ml Syrup',
    sizeOptions: ['120 ml'],
  },
  'murex-tablets': {
    benefits: [
      'Supports mental focus, concentration, and cognitive performance.',
      'Helps support healthy brain function and mental alertness.',
      'Provides nutritional support for everyday mental performance.',
      'Convenient tablet formulation for regular supplementation.',
    ],
    packSizeDetail: 'Pack Size: 14 Tablets',
    packSizeLabel: '14 Tablets',
    sizeOptions: ['14 Tablets'],
  },
  'painset-gel': {
    benefits: [
      'Helps provide targeted relief from muscle and joint discomfort.',
      'Supports relief from soreness associated with everyday physical activity.',
      'Provides soothing topical support to affected areas.',
      'Easy-to-apply gel formulation for convenient localized use.',
    ],
    packSizeDetail: 'Pack Size: 35 g Gel',
    packSizeLabel: '35 g Gel',
    sizeOptions: ['35 g'],
  },
  'tancid-syrup': {
    benefits: [
      'Helps provide fast-acting support for digestive discomfort.',
      'Supports relief from acidity and occasional heartburn.',
      'Helps soothe an irritated stomach and promote digestive comfort.',
      'Convenient liquid formulation for easy intake.',
    ],
    packSizeDetail: 'Pack Size: 120 ml Syrup',
    packSizeLabel: '120 ml Syrup',
    sizeOptions: ['120 ml'],
  },
  'tanicob-tablets': {
    benefits: [
      'Provides Vitamin B12 support with Mecobalamin (Methylcobalamin).',
      'Supports healthy nerve function and neurological wellbeing.',
      'Helps support normal red blood cell formation.',
      'Supports energy metabolism and helps maintain normal vitality.',
    ],
    packSizeDetail: 'Pack Size: 2 × 10 Tablets (2 mg) — 20 Tablets',
    packSizeLabel: '2 × 10 Tablets (2 mg) — 20 Tablets',
    sizeOptions: ['2 mg'],
  },
  't-nase-drops': {
    benefits: [
      'Supports comfortable nasal breathing.',
      'Helps provide soothing support for nasal and upper-respiratory discomfort.',
      'Supports relief from nasal congestion and irritation.',
      'Convenient drop formulation for easy and targeted application.',
    ],
    packSizeDetail: 'Pack Size: 60 ml Drops',
    packSizeLabel: '60 ml Drops',
    sizeOptions: ['60 ml'],
  },
  'vitowell-tablets': {
    benefits: [
      'Provides essential vitamins and minerals to support daily nutritional needs.',
      'Supports healthy energy levels and overall vitality.',
      'Helps support normal immune function and general wellbeing.',
      'Provides convenient nutritional support for everyday health.',
    ],
    packSizeDetail: 'Pack Size: 20 Tablets',
    packSizeLabel: '20 Tablets',
    sizeOptions: ['20 Tablets'],
  },
  'xalmeth-tablets': {
    benefits: [
      'Supports healthy nerve function and neurological wellbeing.',
      "Helps support the body's Vitamin B6, B12, and folate requirements.",
      'Supports normal red blood cell formation and energy metabolism.',
      'Provides bioactive forms of essential B vitamins for effective nutritional support.',
    ],
    packSizeDetail: 'Pack Size: 15 Tablets',
    packSizeLabel: '15 Tablets',
    sizeOptions: ['15 Tablets'],
  },
};

export function getProductHighlights(slug: string): ProductHighlightSeed | undefined {
  return PRODUCT_HIGHLIGHTS[slug.toLowerCase()];
}
