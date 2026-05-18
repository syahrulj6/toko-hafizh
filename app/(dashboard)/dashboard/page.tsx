import { prisma } from '@/lib/prisma';
import { formatIDR } from '@/lib/currency';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeekWindow = new Date(startOfToday);
  startOfWeekWindow.setDate(startOfWeekWindow.getDate() - 6);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [productsCount, ordersCount, revenue, weeklyOrders, statusCounts, monthStats, lastMonthStats] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.findMany({
      where: { createdAt: { gte: startOfWeekWindow } },
      select: { id: true, total: true, status: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.order.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfMonth, lt: startOfNextMonth } },
      _sum: { total: true },
      _count: { _all: true },
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
      _sum: { total: true },
      _count: { _all: true },
    }),
  ]);

  const dayBuckets = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeekWindow);
    date.setDate(startOfWeekWindow.getDate() + i);
    const key = date.toISOString().slice(0, 10);
    return {
      key,
      label: date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      orders: 0,
      revenue: 0,
    };
  });

  const dayIndexMap = new Map(dayBuckets.map((day, index) => [day.key, index]));
  for (const order of weeklyOrders) {
    const key = new Date(order.createdAt).toISOString().slice(0, 10);
    const index = dayIndexMap.get(key);
    if (index === undefined) continue;
    dayBuckets[index].orders += 1;
    dayBuckets[index].revenue += order.total;
  }

  const maxRevenue = Math.max(...dayBuckets.map((day) => day.revenue), 1);
  const statusMap = statusCounts.reduce<Record<string, number>>((acc, item) => {
    acc[item.status] = item._count._all;
    return acc;
  }, {});

  const pendingCount = statusMap.PENDING ?? 0;
  const paidCount = statusMap.PAID ?? 0;
  const shippedCount = statusMap.SHIPPED ?? 0;
  const completedCount = statusMap.COMPLETED ?? 0;
  const canceledCount = statusMap.CANCELED ?? 0;

  const completionRate = ordersCount > 0 ? Math.round((completedCount / ordersCount) * 100) : 0;
  const avgOrderValue = ordersCount > 0 ? (revenue._sum.total ?? 0) / ordersCount : 0;
  const thisMonthRevenue = monthStats._sum.total ?? 0;
  const lastMonthRevenue = lastMonthStats._sum.total ?? 0;
  const revenueGrowthPct =
    lastMonthRevenue > 0 ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100) : thisMonthRevenue > 0 ? 100 : 0;

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-[#1f4122]">Ringkasan Toko</h2>
        <p className="text-sm text-slate-600">Pantau performa toko dari KPI utama, status pesanan, dan tren 7 hari terakhir.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
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
        <article className="rounded-xl border border-[#346739]/20 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Rata-rata Nilai Order</p>
          <p className="mt-1 text-3xl font-bold text-[#1f4122]">{formatIDR(avgOrderValue)}</p>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <article className="rounded-xl border border-[#346739]/20 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#1f4122]">Grafik Pendapatan 7 Hari</p>
              <p className="text-xs text-slate-500">Pendapatan harian dan jumlah order.</p>
            </div>
            <p className="text-xs text-slate-500">Maks: {formatIDR(maxRevenue)}</p>
          </div>

          <div className="grid h-52 grid-cols-7 items-end gap-2">
            {dayBuckets.map((day) => (
              <div key={day.key} className="flex h-full flex-col items-center justify-end gap-2">
                <div className="relative flex h-40 w-full items-end justify-center rounded-md bg-[#f5f8f5]">
                  <div
                    className="w-7 rounded-t-md bg-[#346739]"
                    style={{
                      height: `${Math.max(6, Math.round((day.revenue / maxRevenue) * 100))}%`,
                    }}
                    title={`${day.label}: ${formatIDR(day.revenue)} • ${day.orders} order`}
                  />
                  <span className="absolute -top-5 text-[10px] font-semibold text-[#1f4122]">{day.orders}</span>
                </div>
                <span className="text-[10px] text-slate-500">{day.label}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-[#346739]/20 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-[#1f4122]">Status Pesanan</p>
          <p className="mt-1 text-xs text-slate-500">Distribusi seluruh status order saat ini.</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2"><span>PENDING</span><strong>{pendingCount}</strong></li>
            <li className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2"><span>PAID</span><strong>{paidCount}</strong></li>
            <li className="flex items-center justify-between rounded-lg bg-violet-50 px-3 py-2"><span>SHIPPED</span><strong>{shippedCount}</strong></li>
            <li className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2"><span>COMPLETED</span><strong>{completedCount}</strong></li>
            <li className="flex items-center justify-between rounded-lg bg-rose-50 px-3 py-2"><span>CANCELED</span><strong>{canceledCount}</strong></li>
          </ul>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-[#346739]/20 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Order Bulan Ini</p>
          <p className="mt-1 text-2xl font-bold text-[#1f4122]">{monthStats._count._all}</p>
        </article>
        <article className="rounded-xl border border-[#346739]/20 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Pendapatan Bulan Ini</p>
          <p className="mt-1 text-2xl font-bold text-[#1f4122]">{formatIDR(thisMonthRevenue)}</p>
          <p className={`mt-1 text-xs font-medium ${revenueGrowthPct >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {revenueGrowthPct >= 0 ? '+' : ''}
            {revenueGrowthPct}% vs bulan lalu
          </p>
        </article>
        <article className="rounded-xl border border-[#346739]/20 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Completion Rate</p>
          <p className="mt-1 text-2xl font-bold text-[#1f4122]">{completionRate}%</p>
          <p className="mt-1 text-xs text-slate-500">Persentase order yang selesai dari total order.</p>
        </article>
      </div>

      <article className="rounded-xl border border-[#346739]/20 bg-white p-4 text-sm text-slate-600">
        Prioritas operasional: fokus pada <span className="font-semibold text-[#1f4122]">PENDING ({pendingCount})</span> dan <span className="font-semibold text-[#1f4122]">PAID ({paidCount})</span> agar pengemasan serta pengiriman tidak tertunda.
      </article>
    </section>
  );
}
