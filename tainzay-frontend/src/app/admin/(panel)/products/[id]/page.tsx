import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdminProductEdit from '@/components/admin/AdminProductEdit';
import { fetchAdminProduct } from '@/lib/admin-products';

interface AdminProductEditPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AdminProductEditPageProps): Promise<Metadata> {
  const { id } = await params;
  const { data: product } = await fetchAdminProduct(id);

  return {
    title: product ? `Edit ${product.name}` : 'Edit Product',
    robots: { index: false, follow: false },
  };
}

export default async function AdminProductEditPage({ params }: AdminProductEditPageProps) {
  const { id } = await params;
  const { data: product, error } = await fetchAdminProduct(id);

  if (!product) {
    if (error) {
      return (
        <div className="admin-empty-state">
          <p>We couldn&apos;t load this product.</p>
          <Link href="/admin/products" className="admin-panel-link">
            Back to products
          </Link>
        </div>
      );
    }

    notFound();
  }

  return <AdminProductEdit product={product} />;
}
