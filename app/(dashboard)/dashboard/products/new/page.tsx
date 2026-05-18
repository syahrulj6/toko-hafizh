import Link from 'next/link';
import { ProductForm } from '@/components/dashboard/product-form';

export default function DashboardNewProductPage() {
  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-[#346739]/20 bg-[radial-gradient(circle_at_top_right,rgba(52,103,57,0.15),transparent_45%),linear-gradient(140deg,#ffffff_0%,#f3f9f3_55%,#eaf4ea_100%)] p-5 shadow-sm md:p-6">
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#346739]/15 blur-2xl" />
        <div className="absolute -left-6 bottom-0 h-28 w-28 rounded-full bg-[#8bb78d]/25 blur-2xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#346739]">Panel Admin</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#1f4122]">Tambah Produk</h1>
            <p className="mt-1 text-sm text-slate-600">Buat produk baru yang siap tampil di etalase publik toko.</p>
          </div>
          <Link
            href="/dashboard/products"
            className="inline-flex items-center justify-center rounded-full border border-[#346739]/30 bg-white/85 px-4 py-2 text-sm font-semibold text-[#1f4122] transition hover:bg-white"
          >
            Kembali ke Daftar Produk
          </Link>
        </div>
      </div>

      <ProductForm mode="create" />
    </section>
  );
}
