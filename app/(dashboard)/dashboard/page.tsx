import { prisma } from '@/lib/prisma';
import { formatIDR } from '@/lib/currency';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [productsCount, ordersCount, revenue] = await Promise.all([prisma.product.count(), prisma.order.count(), prisma.order.aggregate({ _sum: { total: true } })]);

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-[#1f4122]">Ringkasan Toko</h2>
        <p className="text-sm text-slate-600">Lihat gambaran cepat performa katalog dan transaksi.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-[#346739]/20 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total Produk</p>
          <p className="mt-1 text-3xl font-bold text-[#1f4122]">{productsCount}</p>
        </article>
        <article className="rounded-xl border border-[#346739]/20 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total Pesanan</p>
          <p className="mt-1 text-3xl font-bold text-[#1f4122]">{ordersCount}</p>
        </article>
        <article className="rounded-xl border border-[#346739]/20 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total Pendapatan</p>
          <p className="mt-1 text-3xl font-bold text-[#1f4122]">{formatIDR(revenue._sum.total ?? 0)}</p>
        </article>
      </div>
      <article className="rounded-xl border border-[#346739]/20 bg-white p-4 text-sm text-slate-600">
        Prioritaskan pesanan dengan status <span className="font-semibold text-[#1f4122]">PENDING</span> dan <span className="font-semibold text-[#1f4122]">PAID</span> agar proses pengemasan serta pengiriman tidak tertunda.
      </article>
    </section>
  );
}
