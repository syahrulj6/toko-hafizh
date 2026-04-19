'use client';

import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/product/product-card';

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
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  if (isLoading) {
    return <p className="text-sm text-slate-600">Memuat produk...</p>;
  }

  if (isError) {
    return <p className="text-sm text-red-600">Gagal memuat produk.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
