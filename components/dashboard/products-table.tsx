'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { formatIDR } from '@/lib/currency';

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
};

async function getAdminProducts(): Promise<Product[]> {
  const res = await fetch('/api/dashboard/products');
  if (!res.ok) {
    throw new Error('Gagal mengambil data produk');
  }
  return res.json();
}

export function ProductsTable() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-products'],
    queryFn: getAdminProducts,
  });

  if (isLoading) {
    return <p className="text-sm text-slate-600">Memuat produk...</p>;
  }

  if (isError) {
    return <p className="text-sm text-red-600">Gagal memuat produk.</p>;
  }

  return (
    <div className="rounded-xl border border-[#346739]/20 bg-white p-4">
      <h2 className="text-lg font-semibold text-[#1f4122]">Daftar Produk</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#346739]/15 text-slate-500">
              <th className="px-2 py-2">Nama</th>
              <th className="px-2 py-2">Harga</th>
              <th className="px-2 py-2">Stok</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((product) => (
              <tr key={product.id} className="border-b border-[#346739]/10">
                <td className="px-2 py-2">{product.name}</td>
                <td className="px-2 py-2">{formatIDR(product.price)}</td>
                <td className="px-2 py-2">{product.stock}</td>
                <td className="px-2 py-2">{product.isActive ? 'Aktif' : 'Nonaktif'}</td>
                <td className="px-2 py-2">
                  <Link href={`/dashboard/products/${product.id}`} className="font-medium text-[#346739]">
                    Ubah
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
