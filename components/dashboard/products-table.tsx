"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { formatIDR } from "@/lib/currency";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
};

async function getAdminProducts(): Promise<Product[]> {
  const res = await fetch("/api/dashboard/products");
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}

export function ProductsTable() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-products"],
    queryFn: getAdminProducts,
  });

  if (isLoading) {
    return <p className="text-sm text-slate-600">Loading products...</p>;
  }

  if (isError) {
    return <p className="text-sm text-red-600">Failed to load products.</p>;
  }

  return (
    <div className="rounded-xl border border-[#346739]/20 bg-white p-4">
      <h2 className="text-lg font-semibold text-[#1f4122]">Product List</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#346739]/15 text-slate-500">
              <th className="px-2 py-2">Name</th>
              <th className="px-2 py-2">Price</th>
              <th className="px-2 py-2">Stock</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((product) => (
              <tr key={product.id} className="border-b border-[#346739]/10">
                <td className="px-2 py-2">{product.name}</td>
                <td className="px-2 py-2">{formatIDR(product.price)}</td>
                <td className="px-2 py-2">{product.stock}</td>
                <td className="px-2 py-2">{product.isActive ? "Active" : "Inactive"}</td>
                <td className="px-2 py-2">
                  <Link href={`/dashboard/products/${product.id}`} className="font-medium text-[#346739]">
                    Edit
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
