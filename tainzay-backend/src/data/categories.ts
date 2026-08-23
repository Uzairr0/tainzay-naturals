/**
 * Category catalogue. Slugs must stay in sync with HOME_CATEGORIES in
 * tainzay-frontend/src/lib/categories.ts, which maps each slug to its icon.
 */
export interface CategorySeed {
  name: string;
  slug: string;
  description: string;
}

export const CATEGORIES: CategorySeed[] = [
  {
    name: 'Antibiotics',
    slug: 'antibiotics',
    description:
      'Antibacterial medicines for treating and managing bacterial infections.',
  },
  {
    name: 'Pain Relief',
    slug: 'pain-relief',
    description:
      'Analgesics and anti-inflammatory preparations for acute and chronic pain.',
  },
  {
    name: 'Vitamins & Minerals',
    slug: 'vitamins-minerals',
    description:
      'Vitamin, mineral and multivitamin supplements supporting daily nutritional needs.',
  },
  {
    name: 'Cardiovascular',
    slug: 'cardiovascular',
    description:
      'Medicines supporting heart health, blood pressure and circulation.',
  },
  {
    name: 'Diabetes Care',
    slug: 'diabetes-care',
    description:
      'Products supporting blood sugar management and diabetic care.',
  },
  {
    name: 'Respiratory',
    slug: 'respiratory',
    description:
      'Preparations for asthma, nasal congestion and other respiratory conditions.',
  },
  {
    name: 'Gastrointestinal',
    slug: 'gastrointestinal',
    description:
      'Antacids and digestive care medicines for stomach and gut health.',
  },
  {
    name: 'Dermatology',
    slug: 'dermatology',
    description: 'Topical treatments for skin conditions and wound care.',
  },
  {
    name: "Women's Health",
    slug: 'womens-health',
    description:
      "Supplements and medicines addressing women's health requirements.",
  },
  {
    name: 'Pediatrics',
    slug: 'pediatrics',
    description: 'Child-friendly formulations and paediatric dosage forms.',
  },
  {
    name: 'Cold & Flu',
    slug: 'cold-flu',
    description:
      'Cough syrups and remedies for cold, flu and seasonal symptoms.',
  },
  {
    name: 'Brain & Vision',
    slug: 'brain-vision',
    description:
      'Supplements supporting cognitive function, memory and eye health.',
  },
];
