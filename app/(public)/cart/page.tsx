"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { formatIDR } from "@/lib/currency";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const subtotal = useCartStore((state) => state.subtotal());

  if (items.length < 1) {
    return (
      <section className="rounded-xl border border-[#346739]/20 bg-white p-6">
        <h1 className="text-xl font-semibold text-[#1f4122]">Your cart is empty</h1>
        <p className="mt-2 text-sm text-slate-600">Add products from the catalog first.</p>
        <Link href="/products" className="mt-4 inline-block text-sm font-medium text-[#346739]">
          Go to products
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-[#1f4122]">Your Cart</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <article
            key={item.productId}
            className="flex items-center justify-between rounded-xl border border-[#346739]/20 bg-white p-4"
          >
            <div>
              <h2 className="font-semibold text-slate-800">{item.name}</h2>
              <p className="text-sm text-slate-500">{formatIDR(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={item.stock}
                value={item.quantity}
                onChange={(event) => setQuantity(item.productId, Number(event.target.value))}
                className="h-9 w-20 rounded-md border border-[#346739]/30 px-2"
              />
              <Button variant="outline" onClick={() => removeItem(item.productId)}>
                Remove
              </Button>
            </div>
          </article>
        ))}
      </div>
      <div className="rounded-xl border border-[#346739]/20 bg-white p-4">
        <p className="text-sm text-slate-600">Subtotal</p>
        <p className="text-xl font-bold text-[#1f4122]">{formatIDR(subtotal)}</p>
        <Link href="/checkout" className="mt-3 inline-block text-sm font-semibold text-[#346739]">
          Continue to checkout
        </Link>
      </div>
    </section>
  );
}

