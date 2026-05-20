import { ProductsCatalog } from '@/components/product/products-catalog';
import Reveal from '@/components/shared/reveal';

export default function ProductsPage() {
  return (
    <section className="space-y-6 md:space-y-8">
      <Reveal className="relative overflow-hidden rounded-2xl border border-[var(--color-brand-border)] bg-[var(--color-brand-soft)] px-5 py-7 md:rounded-3xl md:px-8 md:py-10">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[var(--color-brand-700)]/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 left-8 h-36 w-36 rounded-full bg-[var(--color-brand-900)]/10 blur-2xl" />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-muted)]">Katalog</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--color-brand-900)] md:text-5xl">Temukan Produk Favoritmu</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">Gunakan pencarian dan filter untuk menemukan tas yang paling sesuai kebutuhanmu, dari model harian hingga koleksi premium.</p>
        </div>
      </Reveal>

      <Reveal delayMs={120}>
        <ProductsCatalog />
      </Reveal>
    </section>
  );
}
