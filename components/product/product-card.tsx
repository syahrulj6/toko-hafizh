'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';
import { formatIDR } from '@/lib/currency';
import { useToast } from '@/components/ui/toaster';

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
  const { showToast } = useToast();
  const isOutOfStock = product.stock < 1;

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#346739]/20 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:p-4">
      <div className="relative mb-3 aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100">
        <Image src={product.image} alt={product.name} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-brand-900)]">{isOutOfStock ? 'Stok Habis' : 'Tersedia'}</div>
      </div>
      <h3 className="line-clamp-1 text-base font-bold text-[#1f4122] md:text-lg">{product.name}</h3>
      <p className="mt-1 line-clamp-2 min-h-10 text-sm text-slate-600">{product.description}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-base font-bold text-[#346739]">{formatIDR(product.price)}</span>
        <span className="rounded-full bg-[var(--color-brand-soft)] px-2.5 py-1 text-[11px] font-medium text-slate-600">Stok: {product.stock}</span>
      </div>
      <Button
        className="mt-4 w-full"
        disabled={isOutOfStock}
        onClick={() => {
          const result = addItem({
            productId: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            stock: product.stock,
          });
          showToast({
            title: 'Produk ditambahkan ke keranjang',
            description: `${product.name} sekarang ada ${result.totalQuantity} di keranjang.`,
            actionLabel: 'Lihat keranjang',
            actionHref: '/cart',
          });
        }}
      >
        {isOutOfStock ? 'Stok habis' : 'Tambah ke Keranjang'}
      </Button>
    </article>
  );
}
