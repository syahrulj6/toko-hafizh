'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from 'lucide-react';
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
      <section className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--color-brand-border)] bg-[var(--color-brand-soft)] px-4 py-10 shadow-[0_20px_60px_rgba(52,103,57,0.08)] sm:px-6 sm:py-14 lg:px-10">
        <div className="absolute -right-16 top-0 h-40 w-40 rounded-full bg-[#e6efe7]/70 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-[#346739]/10 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-brand-muted)]">Tas Hafizh Signature</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-[var(--color-brand-900)] sm:text-5xl">Keranjang Belanja</h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-slate-600 sm:text-base">Keranjangmu masih kosong. Tambahkan produk favorit dari katalog untuk melihat ringkasan pesanan dan melanjutkan checkout.</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-brand-700)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-600)]">
                Lihat Produk
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-[var(--color-brand-border)] bg-white/80 px-5 py-3 text-sm font-semibold text-[var(--color-brand-900)] transition hover:bg-white">
                Kembali ke Beranda
              </Link>
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-[var(--color-brand-border)] bg-white/85 p-5 shadow-[0_18px_45px_rgba(52,103,57,0.08)] backdrop-blur-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-brand-soft)] text-[var(--color-brand-700)]">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-brand-900)]">Keranjang kosong</p>
                <p className="text-xs text-slate-600">Belum ada produk dipilih</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 text-sm">
              <div className="flex items-center justify-between rounded-xl bg-[var(--color-brand-soft)] px-4 py-3">
                <span className="text-slate-600">Akses katalog</span>
                <span className="font-semibold text-[var(--color-brand-900)]">Mudah</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[var(--color-brand-soft)] px-4 py-3">
                <span className="text-slate-600">Checkout</span>
                <span className="font-semibold text-[var(--color-brand-900)]">Cepat</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--color-brand-border)] bg-[var(--color-brand-soft)] px-4 py-6 shadow-[0_20px_60px_rgba(52,103,57,0.08)] sm:px-6 sm:py-8 lg:px-8">
      <div className="absolute -right-16 top-0 h-40 w-40 rounded-full bg-[#e6efe7]/70 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-[#346739]/10 blur-3xl" />

      <div className="relative mb-6 max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-brand-muted)]">Tas Hafizh Signature</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--color-brand-900)] sm:text-5xl">Keranjang Belanja</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">Tinjau produk, atur jumlah, lalu lanjutkan ke pembayaran dengan ringkasan yang tetap rapi di layar kecil maupun besar.</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <div className="rounded-full border border-[var(--color-brand-border)] bg-white/75 px-4 py-2 text-[var(--color-brand-900)] shadow-sm">
            <span className="font-semibold">{items.length}</span> produk
          </div>
          <div className="rounded-full border border-[var(--color-brand-border)] bg-white/75 px-4 py-2 text-[var(--color-brand-900)] shadow-sm">
            <span className="font-semibold">{formatIDR(subtotal)}</span> subtotal
          </div>
          <div className="rounded-full border border-[var(--color-brand-border)] bg-white/75 px-4 py-2 text-[var(--color-brand-900)] shadow-sm">
            <span className="font-semibold">{formatIDR(shipping)}</span> ongkir
          </div>
        </div>
      </div>

      <div className="relative mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="space-y-4 sm:space-y-5">
          {items.map((item) => {
            const lineTotal = item.price * item.quantity;

            return (
              <article key={item.productId} className="rounded-[1.6rem] border border-[var(--color-brand-border)] bg-white/85 p-4 shadow-[0_14px_35px_rgba(52,103,57,0.08)] backdrop-blur-sm sm:p-5">
                <div className="grid gap-4 sm:grid-cols-[112px_minmax(0,1fr)_auto] sm:gap-5">
                  <div className="relative aspect-square overflow-hidden rounded-[1.35rem] bg-white shadow-[0_10px_30px_rgba(52,103,57,0.08)] ring-1 ring-[var(--color-brand-border)]">
                    <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" />
                  </div>

                  <div className="flex min-w-0 flex-col justify-between gap-4 py-1">
                    <div className="space-y-1">
                      <h2 className="text-base font-semibold tracking-tight text-[var(--color-brand-900)] sm:text-lg">{item.name}</h2>
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-brand-muted)]">{item.stock > 0 ? 'Tersedia' : 'Habis'}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm sm:gap-4">
                      <div className="flex items-center gap-3 rounded-full border border-[var(--color-brand-border)] bg-[var(--color-brand-soft)] px-3 py-2 text-slate-600 shadow-sm">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-muted)]">Jumlah</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setQuantity(item.productId, item.quantity - 1)}
                            className="grid h-8 w-8 place-items-center rounded-full border border-[var(--color-brand-border)] bg-white text-[var(--color-brand-900)] transition hover:bg-[var(--color-brand-hover-bg)]"
                            aria-label={`Kurangi jumlah ${item.name}`}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-[var(--color-brand-900)]">{String(item.quantity).padStart(2, '0')}</span>
                          <button
                            type="button"
                            onClick={() => setQuantity(item.productId, item.quantity + 1)}
                            className="grid h-8 w-8 place-items-center rounded-full border border-[var(--color-brand-border)] bg-white text-[var(--color-brand-900)] transition hover:bg-[var(--color-brand-hover-bg)]"
                            aria-label={`Tambah jumlah ${item.name}`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--color-brand-muted)]">{formatIDR(item.price)} / item</p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-4 border-t border-[var(--color-brand-border)] pt-4 sm:mt-0 sm:flex-col sm:items-end sm:border-0 sm:pt-0 sm:text-right">
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-brand-muted)] transition hover:bg-[var(--color-brand-soft)] hover:text-[var(--color-brand-900)]"
                      aria-label={`Hapus ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-muted)]">Subtotal</p>
                      <p className="mt-1 text-xl font-extrabold tracking-tight text-[var(--color-brand-700)]">{formatIDR(lineTotal)}</p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="rounded-[1.6rem] border border-[var(--color-brand-border)] bg-white/85 p-5 shadow-[0_18px_45px_rgba(52,103,57,0.08)] backdrop-blur-sm lg:sticky lg:top-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold tracking-tight text-[var(--color-brand-900)]">Ringkasan Pesanan</h2>
            <span className="rounded-full bg-[var(--color-brand-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-muted)]">{items.length} item</span>
          </div>

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
