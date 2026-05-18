'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatIDR } from '@/lib/currency';

type Product = {
  id: string;
  image: string;
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-products'],
    queryFn: getAdminProducts,
  });

  async function deleteProduct(productId: string, productName: string) {
    const confirmed = window.confirm(`Hapus produk "${productName}"? Tindakan ini tidak bisa dibatalkan.`);
    if (!confirmed) return;

    setDeletingId(productId);

    const res = await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      let message = 'Gagal menghapus produk.';
      try {
        const payload = (await res.json()) as { message?: string };
        if (payload?.message) {
          message = payload.message;
        }
      } catch {
        // keep default message
      }
      alert(message);
      setDeletingId(null);
      return;
    }

    setDeletingId(null);
    window.location.reload();
  }

  if (isLoading) {
    return <p className="text-sm text-slate-600">Memuat produk...</p>;
  }

  if (isError) {
    return <p className="text-sm text-red-600">Gagal memuat produk.</p>;
  }

  return (
    <div className="rounded-xl border border-[#346739]/20 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#1f4122]">Daftar Produk</h2>
        <p className="text-sm text-slate-500">Semua item yang tampil di etalase publik.</p>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#346739]/15 text-slate-500">
              <th className="px-2 py-2">Gambar</th>
              <th className="px-2 py-2">Nama</th>
              <th className="px-2 py-2">Harga</th>
              <th className="px-2 py-2">Stok</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data?.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-2 py-8 text-center text-sm text-slate-500">
                  Belum ada produk. Buka menu Tambah Produk untuk membuat produk pertama Anda.
                </td>
              </tr>
            ) : null}
            {data?.map((product) => (
              <tr key={product.id} className="border-b border-[#346739]/10">
                <td className="px-2 py-2">
                  <div className="relative h-12 w-12 overflow-hidden rounded-md border border-[#346739]/20 bg-slate-100">
                    <Image src={product.image} alt={product.name} fill sizes="48px" className="object-cover" />
                  </div>
                </td>
                <td className="px-2 py-2">{product.name}</td>
                <td className="px-2 py-2">{formatIDR(product.price)}</td>
                <td className="px-2 py-2">{product.stock}</td>
                <td className="px-2 py-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      product.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {product.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-3">
                    <Link href={`/dashboard/products/${product.id}`} className="font-medium text-[#346739] hover:underline">
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => deleteProduct(product.id, product.name)}
                      disabled={deletingId === product.id}
                      className="font-medium text-rose-600 transition hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === product.id ? 'Menghapus...' : 'Hapus'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
