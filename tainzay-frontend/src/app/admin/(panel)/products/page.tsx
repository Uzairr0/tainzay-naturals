import type { Metadata } from 'next';
import AdminProductsManager from '@/components/admin/AdminProductsManager';
import {
  fetchAdminProducts,
  parseAdminProductStockFilter,
} from '@/lib/admin-products';

export const metadata: Metadata = {
  title: 'Products',
  robots: { index: false, follow: false },
};

interface AdminProductsPageProps {
  searchParams: Promise<{ search?: string; stock?: string }>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const { search = '', stock: stockParam } = await searchParams;
  const stock = parseAdminProductStockFilter(stockParam);

  const { data, error } = await fetchAdminProducts({ search, stock });

  return (
    <AdminProductsManager
      key={`${search}-${stock}`}
      products={data.products}
      initialSearch={search}
      initialStock={stock}
      total={data.pagination.total}
      error={error}
    />
  );
}
