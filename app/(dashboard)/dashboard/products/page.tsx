import Link from "next/link";
import { ProductsTable } from "@/components/dashboard/products-table";

export default function DashboardProductsPage() {
  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-[#346739]/20 bg-[linear-gradient(130deg,#ffffff_0%,#f2f8f2_48%,#e8f3e8_100%)] p-5 shadow-sm md:p-6">
        <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-[#346739]/10 blur-2xl" />
        <div className="absolute -left-8 -bottom-10 h-32 w-32 rounded-full bg-[#7aa77d]/20 blur-2xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1f4122]">Daftar Produk</h1>
            <p className="mt-1 text-sm text-slate-600">Kelola item toko, lihat stok, dan masuk ke halaman edit produk.</p>
          </div>
          <Link
            href="/dashboard/products/new"
            className="inline-flex items-center justify-center rounded-full bg-[#346739] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d5b31]"
          >
            + Tambah Produk Baru
          </Link>
        </div>
      </div>

      <ProductsTable />
    </section>
  );
}

