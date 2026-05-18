import { prisma } from '@/lib/prisma';
import { formatIDR } from '@/lib/currency';
import RevenueOrdersChart from '@/components/dashboard/revenue-orders-chart';

export const dynamic = 'force-dynamic';

type DashboardPageProps = {
  searchParams?: {
    range?: string;
  };
};

function getJakartaDateKey(date: Date) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
}

function getUtcFromJakartaMidnight(year: number, monthIndex: number, day: number) {
  return new Date(Date.UTC(year, monthIndex, day, -7, 0, 0));
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const now = new Date();
  const jakartaDateParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const jakartaYear = Number(jakartaDateParts.find((part) => part.type === 'year')?.value ?? now.getFullYear());
  const jakartaMonthIndex = Number(jakartaDateParts.find((part) => part.type === 'month')?.value ?? now.getMonth() + 1) - 1;
  const jakartaDay = Number(jakartaDateParts.find((part) => part.type === 'day')?.value ?? now.getDate());

  const selectedRange = searchParams?.range === '1m' || searchParams?.range === '1y' ? searchParams.range : '7d';
  const todayJakartaStartUtc = getUtcFromJakartaMidnight(jakartaYear, jakartaMonthIndex, jakartaDay);
  const tomorrowJakartaStartUtc = getUtcFromJakartaMidnight(jakartaYear, jakartaMonthIndex, jakartaDay + 1);

  const chartStartUtc = new Date(todayJakartaStartUtc);
  if (selectedRange === '7d') chartStartUtc.setUTCDate(chartStartUtc.getUTCDate() - 6);
  if (selectedRange === '1m') chartStartUtc.setUTCDate(chartStartUtc.getUTCDate() - 29);
  if (selectedRange === '1y') chartStartUtc.setUTCFullYear(chartStartUtc.getUTCFullYear() - 1);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [productsCount, ordersCount, revenue, chartOrders, statusCounts, monthStats, lastMonthStats] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.findMany({
      where: { createdAt: { gte: chartStartUtc, lt: tomorrowJakartaStartUtc } },
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

  const chartPoints: Array<{ key: string; label: string; orders: number; revenue: number }> = [];
  if (selectedRange === '1y') {
    const monthBuckets = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(jakartaYear, jakartaMonthIndex - 11 + i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return {
        key,
        label: date.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }),
        orders: 0,
        revenue: 0,
      };
    });
    const monthIndexMap = new Map(monthBuckets.map((month, index) => [month.key, index]));
    for (const order of chartOrders) {
      const d = new Date(order.createdAt);
      const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit' }).formatToParts(d);
      const y = parts.find((p) => p.type === 'year')?.value;
      const m = parts.find((p) => p.type === 'month')?.value;
      const key = `${y}-${m}`;
      const idx = monthIndexMap.get(key);
      if (idx === undefined) continue;
      monthBuckets[idx].orders += 1;
      monthBuckets[idx].revenue += order.total;
    }
    chartPoints.push(...monthBuckets);
  } else {
    const totalDays = selectedRange === '7d' ? 7 : 30;
    const dayBuckets = Array.from({ length: totalDays }, (_, i) => {
      const date = new Date(todayJakartaStartUtc);
      date.setUTCDate(todayJakartaStartUtc.getUTCDate() - (totalDays - 1 - i));
      const key = getJakartaDateKey(date);
      return {
        key,
        label: date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
        orders: 0,
        revenue: 0,
      };
    });
    const dayIndexMap = new Map(dayBuckets.map((day, index) => [day.key, index]));
    for (const order of chartOrders) {
      const key = getJakartaDateKey(new Date(order.createdAt));
      const index = dayIndexMap.get(key);
      if (index === undefined) continue;
      dayBuckets[index].orders += 1;
      dayBuckets[index].revenue += order.total;
    }
    chartPoints.push(...dayBuckets);
  }

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
        <p className="text-sm text-slate-600">Pantau performa toko dari KPI utama, status pesanan, dan tren pendapatan/order sesuai rentang waktu.</p>
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
          <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#1f4122]">Grafik Pendapatan & Order</p>
              <p className="text-xs text-slate-500">Data asli pesanan dengan filter 7 hari, 1 bulan, atau 1 tahun (Asia/Jakarta).</p>
            </div>
            <form method="get" className="flex items-center gap-2">
              <select
                name="range"
                defaultValue={selectedRange}
                className="rounded-lg border border-[#346739]/30 bg-white px-3 py-2 text-xs font-medium text-[#1f4122] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#346739]/45"
              >
                <option value="7d">7 Hari</option>
                <option value="1m">1 Bulan</option>
                <option value="1y">1 Tahun</option>
              </select>
              <button
                type="submit"
                className="rounded-lg bg-[#346739] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#2d5b31]"
              >
                Terapkan
              </button>
            </form>
          </div>

          <RevenueOrdersChart data={chartPoints} />
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
