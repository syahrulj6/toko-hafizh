"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { formatIDR } from "@/lib/currency";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    price: number;
    stock: number;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <article className="rounded-xl border border-[#346739]/20 bg-white p-4 shadow-sm">
      <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-lg bg-slate-100">
        <Image src={product.image} alt={product.name} fill className="object-cover" />
      </div>
      <h3 className="text-lg font-semibold text-[#1f4122]">{product.name}</h3>
      <p className="mt-1 text-sm text-slate-600">{product.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-[#346739]">{formatIDR(product.price)}</span>
        <span className="text-xs text-slate-500">Stock: {product.stock}</span>
      </div>
      <Button
        className="mt-4 w-full"
        disabled={product.stock < 1}
        onClick={() =>
          addItem({
            productId: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            stock: product.stock,
          })
        }
      >
        {product.stock < 1 ? "Out of Stock" : "Add to Cart"}
      </Button>
    </article>
  );
}

