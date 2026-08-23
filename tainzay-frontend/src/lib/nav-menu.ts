import { HOME_CATEGORIES } from '@/lib/categories';
import type { Product } from '@/types';

export interface NavMenuProduct {
  name: string;
  slug: string;
}

export interface NavMenuCategory {
  name: string;
  slug: string;
  products: NavMenuProduct[];
}

/** Group catalogue products into home-page category order for the nav mega menu */
export function buildNavMenuCategories(products: Product[]): NavMenuCategory[] {
  const productsByCategory = new Map<string, NavMenuProduct[]>();

  for (const product of products) {
    const slug = product.category?.slug;
    if (!slug) continue;

    const list = productsByCategory.get(slug) ?? [];
    list.push({ name: product.name, slug: product.slug });
    productsByCategory.set(slug, list);
  }

  return HOME_CATEGORIES.map((category) => ({
    name: category.name,
    slug: category.slug,
    products: productsByCategory.get(category.slug) ?? [],
  })).filter((category) => category.products.length > 0);
}
