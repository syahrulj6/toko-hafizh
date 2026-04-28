'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Minus, Plus, ShieldCheck, Trash2, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';
import { formatIDR } from '@/lib/currency';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const subtotal = useCartStore((state) => state.subtotal());
  const shipping = items.length > 0 ? 50000 : 0;
  const total = subtotal + shipping;

  if (items.length < 1) {
    return (
      <section className="relative overflow-hidden rounded-[2rem] border border-[var(--color-brand-border)] bg-[var(--color-brand-soft)] p-8 shadow-[0_20px_60px_rgba(52,103,57,0.08)]">
        <div className="absolute -right-16 top-0 h-40 w-40 rounded-full bg-[#e6efe7]/70 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-[#346739]/10 blur-3xl" />

        <div className="relative max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-brand-muted)]">Tas Hafizh Signature</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--color-brand-900)] sm:text-5xl">Keranjang Belanja</h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">Keranjangmu masih kosong. Tambahkan produk favorit dari katalog untuk melihat ringkasan pesanan dan melanjutkan checkout.</p>

          <Link href="/products" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-brand-700)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-600)]">
            Lihat Produk
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[var(--color-brand-border)] bg-[var(--color-brand-soft)] px-4 py-6 shadow-[0_20px_60px_rgba(52,103,57,0.08)] sm:px-6 lg:px-8">
      <div className="absolute -right-16 top-0 h-40 w-40 rounded-full bg-[#e6efe7]/70 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-[#346739]/10 blur-3xl" />

      <div className="relative mb-6 max-w-xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-brand-muted)]">Tas Hafizh Signature</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--color-brand-900)] sm:text-5xl">Keranjang Belanja</h1>
      </div>

      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="space-y-6">
          {items.map((item) => {
            const lineTotal = item.price * item.quantity;

            return (
              <article key={item.productId} className="grid gap-4 rounded-[1.6rem] bg-transparent py-2 sm:grid-cols-[112px_minmax(0,1fr)_auto] sm:gap-5">
                <div className="relative aspect-square overflow-hidden rounded-[1.35rem] bg-white shadow-[0_10px_30px_rgba(52,103,57,0.08)] ring-1 ring-[var(--color-brand-border)]">
                  <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" />
                </div>

                <div className="flex min-w-0 flex-col justify-between gap-4 py-1">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold tracking-tight text-[var(--color-brand-900)]">{item.name}</h2>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-brand-muted)]">{item.stock > 0 ? 'Tersedia' : 'Habis'}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-3 rounded-full border border-[var(--color-brand-border)] bg-white/80 px-3 py-2 text-slate-600 shadow-sm">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-muted)]">Jumlah</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQuantity(item.productId, item.quantity - 1)}
                          className="grid h-7 w-7 place-items-center rounded-full border border-[var(--color-brand-border)] text-[var(--color-brand-900)] transition hover:bg-[var(--color-brand-hover-bg)]"
                          aria-label={`Kurangi jumlah ${item.name}`}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-[var(--color-brand-900)]">{String(item.quantity).padStart(2, '0')}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(item.productId, item.quantity + 1)}
                          className="grid h-7 w-7 place-items-center rounded-full border border-[var(--color-brand-border)] text-[var(--color-brand-900)] transition hover:bg-[var(--color-brand-hover-bg)]"
                          aria-label={`Tambah jumlah ${item.name}`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--color-brand-muted)]">{formatIDR(item.price)} / item</p>
                  </div>
                </div>

                <div className="flex flex-col items-start justify-between gap-5 sm:items-end sm:text-right">
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-brand-muted)] transition hover:bg-white hover:text-[var(--color-brand-900)]"
                    aria-label={`Hapus ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-muted)]">Subtotal</p>
                    <p className="mt-1 text-xl font-extrabold tracking-tight text-[var(--color-brand-700)]">{formatIDR(lineTotal)}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="rounded-[1.6rem] border border-[var(--color-brand-border)] bg-white/75 p-5 shadow-[0_18px_45px_rgba(52,103,57,0.08)] backdrop-blur-sm">
          <h2 className="text-xl font-bold tracking-tight text-[var(--color-brand-900)]">Ringkasan Pesanan</h2>

          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4 text-slate-600">
              <dt>Subtotal</dt>
              <dd className="font-semibold text-[var(--color-brand-900)]">{formatIDR(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 text-slate-600">
              <dt>Ongkos Kirim (Estimasi)</dt>
              <dd className="font-semibold text-[var(--color-brand-900)]">{formatIDR(shipping)}</dd>
            </div>
          </dl>

          <div className="mt-6 flex items-end justify-between gap-4 border-t border-[var(--color-brand-border)] pt-5">
            <div>
              <p className="text-sm font-semibold text-[var(--color-brand-900)]">Total Akhir</p>
              <p className="mt-1 text-2xl font-black tracking-tight text-[var(--color-brand-700)]">{formatIDR(total)}</p>
            </div>
          </div>

          <Button asChild className="mt-5 w-full rounded-xl text-sm font-semibold uppercase tracking-[0.12em]" size="lg">
            <Link href="/checkout" className="inline-flex items-center justify-center gap-2">
              Lanjut ke Pembayaran
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>

          <div className="mt-5 space-y-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-brand-muted)]">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-[var(--color-brand-700)]" />
              <span>Pembayaran aman terenkripsi</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-[var(--color-brand-700)]" />
              <span>Pengiriman seluruh Indonesia</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
