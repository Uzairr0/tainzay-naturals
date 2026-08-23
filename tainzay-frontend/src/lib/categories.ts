export interface HomeCategory {
  name: string;
  slug: string;
  image: string;
}

/** 3D category icons — matched to Herbiotics reference layout */
export const HOME_CATEGORIES: HomeCategory[] = [
  {
    name: 'Antibiotics',
    slug: 'antibiotics',
    image: '/categories/category-09.jpg',
  },
  {
    name: 'Pain Relief',
    slug: 'pain-relief',
    image: '/categories/category-05.jpg',
  },
  {
    name: 'Vitamins & Minerals',
    slug: 'vitamins-minerals',
    image: '/categories/category-11.jpg',
  },
  {
    name: 'Cardiovascular',
    slug: 'cardiovascular',
    image: '/categories/category-08.jpg',
  },
  {
    name: 'Diabetes Care',
    slug: 'diabetes-care',
    image: '/categories/category-06.jpg',
  },
  {
    name: 'Respiratory',
    slug: 'respiratory',
    image: '/categories/category-14.jpg',
  },
  {
    name: 'Gastrointestinal',
    slug: 'gastrointestinal',
    image: '/categories/category-14.jpg',
  },
  {
    name: 'Dermatology',
    slug: 'dermatology',
    image: '/categories/category-02.jpg',
  },
  {
    name: "Women's Health",
    slug: 'womens-health',
    image: '/categories/category-01.jpg',
  },
  {
    name: 'Pediatrics',
    slug: 'pediatrics',
    image: '/categories/category-04.jpg',
  },
  {
    name: 'Cold & Flu',
    slug: 'cold-flu',
    image: '/categories/category-09.jpg',
  },
  {
    name: 'Brain & Vision',
    slug: 'brain-vision',
    image: '/categories/category-12.jpg',
  },
];

export const HOME_CATEGORIES_PREVIEW_COUNT = 12;

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  HOME_CATEGORIES.map((category) => [category.slug, category.name]),
);

/** Categories that currently have at least one product in the catalogue */
export function filterHomeCategoriesWithProducts(
  categoryFacets: Array<{ slug: string; count: number }>,
): HomeCategory[] {
  const counts = new Map(categoryFacets.map((facet) => [facet.slug, facet.count]));

  return HOME_CATEGORIES.filter((category) => (counts.get(category.slug) ?? 0) > 0);
}

/** All twelve catalogue categories, with a zero count when the facet list omits one */
export function withFacetCounts(
  facets: Array<{ slug: string; count: number }>,
): Array<{ name: string; slug: string; count: number }> {
  const counts = new Map(facets.map((facet) => [facet.slug, facet.count]));

  return HOME_CATEGORIES.map((category) => ({
    name: category.name,
    slug: category.slug,
    count: counts.get(category.slug) ?? 0,
  }));
}
