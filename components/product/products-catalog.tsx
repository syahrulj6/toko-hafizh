"use client";

import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/product/product-card";

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
  const res = await fetch("/api/products");
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}

export function ProductsCatalog() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isLoading) {
    return <p className="text-sm text-slate-600">Loading products...</p>;
  }

  if (isError) {
    return <p className="text-sm text-red-600">Failed to load products.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}
