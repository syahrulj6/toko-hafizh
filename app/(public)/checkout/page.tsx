'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, type CheckoutInput } from '@/lib/validators/checkout';
import { normalizeIndonesianPhoneInput } from '@/lib/phone';
import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatIDR } from '@/lib/currency';

const checkoutFormSchema = checkoutSchema.omit({ items: true });

type CheckoutFormInput = Omit<CheckoutInput, 'items'>;

export default function CheckoutPage() {
  const [error, setError] = useState<string>('');
  const { status } = useSession();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());
  const clearCart = useCartStore((state) => state.clearCart);

  const form = useForm<CheckoutFormInput>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '+62',
      customerAddr: '',
      notes: '',
    },
  });

  const customerPhoneValue = form.watch('customerPhone');

  useEffect(() => {
    if (status === 'unauthenticated') {
      const callbackUrl = encodeURIComponent('/checkout');
      window.location.assign(`/login?callbackUrl=${callbackUrl}`);
    }
  }, [status]);

  // fetch profile to autofill form when authenticated
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) return;
        const data = await res.json();
        if (data.name) form.setValue('customerName', data.name, { shouldDirty: false });
        if (data.phone) form.setValue('customerPhone', normalizeIndonesianPhoneInput(data.phone), { shouldDirty: false });
        if (data.address) form.setValue('customerAddr', data.address, { shouldDirty: false });
      } catch (e) {
        // ignore
      }
    }

    if (status === 'authenticated') loadProfile();
  }, [status]);

  if (status === 'loading') {
    return <p className="text-sm text-slate-600">Memeriksa sesi login...</p>;
  }

  if (status === 'unauthenticated') {
    return <p className="text-sm text-slate-600">Mengarahkan ke halaman login...</p>;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setError('');

    if (items.length < 1) {
      setError('Keranjang Anda kosong.');
      return;
    }

    const payload: CheckoutInput = {
      ...values,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { message?: string } | null;
      setError(body?.message ?? 'Pembayaran gagal');
      return;
    }

    const body = (await res.json()) as { waUrl: string };
    clearCart();
    // open WhatsApp checkout in a new tab so user keeps the site open
    window.open(body.waUrl, '_blank', 'noopener,noreferrer');
  });

  return (
    <section className="grid gap-4 md:grid-cols-[2fr_1fr]">
      <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-[#346739]/20 bg-white p-4">
        <h1 className="text-2xl font-bold text-[#1f4122]">Pembayaran</h1>
        <Input placeholder="Nama lengkap" {...form.register('customerName')} />
        <Input
          type="tel"
          inputMode="tel"
          placeholder="+62 8xx..."
          value={customerPhoneValue}
          onChange={(event) =>
            form.setValue('customerPhone', normalizeIndonesianPhoneInput(event.target.value), {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            })
          }
        />
        <textarea className="min-h-28 w-full rounded-lg border border-[#346739]/30 p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#346739]/45" placeholder="Alamat" {...form.register('customerAddr')} />
        <textarea className="min-h-24 w-full rounded-lg border border-[#346739]/30 p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#346739]/45" placeholder="Catatan (opsional)" {...form.register('notes')} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Sedang diproses...' : 'Lanjut ke WhatsApp'}
        </Button>
      </form>

      <aside className="rounded-xl border border-[#346739]/20 bg-white p-4">
        <h2 className="text-lg font-semibold text-[#1f4122]">Ringkasan Pesanan</h2>
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
