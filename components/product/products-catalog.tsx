'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/product/product-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  price: number;
  stock: number;
};

async function getProducts(): Promise<Product[]> {
  const res = await fetch('/api/products');
  if (!res.ok) {
    throw new Error('Gagal mengambil produk');
  }
  return res.json();
}

export function ProductsCatalog() {
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');
  const [sortBy, setSortBy] = useState<'name-asc' | 'price-asc' | 'price-desc'>('name-asc');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const filteredProducts = useMemo(() => {
    const products = data ?? [];
    const query = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesSearch = !query || product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);

      const matchesStock = stockFilter === 'all' || (stockFilter === 'in-stock' ? product.stock > 0 : product.stock < 1);

      return matchesSearch && matchesStock;
    });

    return result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });
  }, [data, search, stockFilter, sortBy]);

  const totalProducts = data?.length ?? 0;

  if (isLoading) {
    return <p className="text-sm text-slate-600">Memuat produk...</p>;
  }

  if (isError) {
    return <p className="text-sm text-red-600">Gagal memuat produk.</p>;
  }

  return (
    <div className="space-y-5 md:space-y-6">
      <div className="space-y-3 rounded-2xl border border-[#346739]/15 bg-white p-3 shadow-sm md:p-4">
        <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto]">
          <Input placeholder="Cari produk..." value={search} onChange={(event) => setSearch(event.target.value)} />

          <select
            className="h-10 w-full rounded-lg border border-[#346739]/30 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#346739]/45"
            value={stockFilter}
            onChange={(event) => setStockFilter(event.target.value as 'all' | 'in-stock' | 'out-of-stock')}
          >
            <option value="all">Semua stok</option>
            <option value="in-stock">Tersedia</option>
            <option value="out-of-stock">Habis</option>
          </select>

          <select
            className="h-10 w-full rounded-lg border border-[#346739]/30 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#346739]/45"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as 'name-asc' | 'price-asc' | 'price-desc')}
          >
            <option value="name-asc">Urutkan: Nama A-Z</option>
            <option value="price-asc">Urutkan: Harga terendah</option>
            <option value="price-desc">Urutkan: Harga tertinggi</option>
          </select>

          <Button
            variant="outline"
            className="w-full md:w-auto"
            onClick={() => {
              setSearch('');
              setStockFilter('all');
              setSortBy('name-asc');
            }}
          >
            Reset
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[var(--color-brand-soft)] px-3 py-2">
          <p className="text-xs font-medium text-slate-600">
            Menampilkan <span className="font-bold text-[var(--color-brand-900)]">{filteredProducts.length}</span> dari {totalProducts} produk
          </p>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#346739]/30 bg-white p-8 text-center">
          <p className="text-sm font-medium text-slate-600">Produk tidak ditemukan untuk filter saat ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
