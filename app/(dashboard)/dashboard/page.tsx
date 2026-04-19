import { prisma } from '@/lib/prisma';
import { formatIDR } from '@/lib/currency';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [productsCount, ordersCount, revenue] = await Promise.all([prisma.product.count(), prisma.order.count(), prisma.order.aggregate({ _sum: { total: true } })]);

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <article className="rounded-xl border border-[#346739]/20 bg-white p-4">
        <p className="text-sm text-slate-500">Produk</p>
        <p className="mt-1 text-3xl font-bold text-[#1f4122]">{productsCount}</p>
      </article>
      <article className="rounded-xl border border-[#346739]/20 bg-white p-4">
        <p className="text-sm text-slate-500">Pesanan</p>
        <p className="mt-1 text-3xl font-bold text-[#1f4122]">{ordersCount}</p>
      </article>
      <article className="rounded-xl border border-[#346739]/20 bg-white p-4">
        <p className="text-sm text-slate-500">Pendapatan</p>
        <p className="mt-1 text-3xl font-bold text-[#1f4122]">{formatIDR(revenue._sum.total ?? 0)}</p>
      </article>
    </section>
  );
}
