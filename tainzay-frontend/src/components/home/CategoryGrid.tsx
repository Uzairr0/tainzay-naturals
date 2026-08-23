import Image from 'next/image';
import Link from 'next/link';
import type { HomeCategory } from '@/lib/categories';

interface CategoryGridProps {
  categories: HomeCategory[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-surface-white">
      <div className="container-site">
        <div className="section-heading">
          <h2 className="section-heading-text">Our Product Categories</h2>
        </div>

        <ul className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-2 gap-y-8 sm:gap-x-3 sm:gap-y-10 md:gap-y-12">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/categories/${category.slug}`}
                className="category-grid-item group"
              >
                <div className="category-grid-image-wrap">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={100}
                    height={100}
                    className="category-grid-image"
                    sizes="(max-width: 640px) 72px, (max-width: 1024px) 88px, 100px"
                  />
                </div>
                <span className="category-grid-label">{category.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex justify-center mt-10 md:mt-12">
          <Link href="/products" className="btn-primary-dark min-w-[180px]">
            View More
          </Link>
        </div>
      </div>
    </section>
  );
}
