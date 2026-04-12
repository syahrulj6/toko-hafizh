"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutInput } from "@/lib/validators/checkout";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatIDR } from "@/lib/currency";

export default function CheckoutPage() {
  const [error, setError] = useState<string>("");
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());
  const clearCart = useCartStore((state) => state.clearCart);

  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerAddr: "",
      notes: "",
      items: [],
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError("");

    if (items.length < 1) {
      setError("Your cart is empty.");
      return;
    }

    const payload: CheckoutInput = {
      ...values,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { message?: string } | null;
      setError(body?.message ?? "Checkout failed");
      return;
    }

    const body = (await res.json()) as { waUrl: string };
    clearCart();
    window.location.assign(body.waUrl);
  });

  return (
    <section className="grid gap-4 md:grid-cols-[2fr_1fr]">
      <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-[#346739]/20 bg-white p-4">
        <h1 className="text-2xl font-bold text-[#1f4122]">Checkout</h1>
        <Input placeholder="Full name" {...form.register("customerName")} />
        <Input placeholder="Phone number" {...form.register("customerPhone")} />
        <textarea
          className="min-h-28 w-full rounded-lg border border-[#346739]/30 p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#346739]/45"
          placeholder="Address"
          {...form.register("customerAddr")}
        />
        <textarea
          className="min-h-24 w-full rounded-lg border border-[#346739]/30 p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#346739]/45"
          placeholder="Notes (optional)"
          {...form.register("notes")}
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Processing..." : "Checkout via WhatsApp"}
        </Button>
      </form>

      <aside className="rounded-xl border border-[#346739]/20 bg-white p-4">
        <h2 className="text-lg font-semibold text-[#1f4122]">Order Summary</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between">
              <span>
                {item.name} x{item.quantity}
              </span>
              <span>{formatIDR(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-[#346739]/20 pt-3">
          <p className="text-sm text-slate-500">Total</p>
          <p className="text-xl font-bold text-[#1f4122]">{formatIDR(subtotal)}</p>
        </div>
      </aside>
    </section>
  );
}

