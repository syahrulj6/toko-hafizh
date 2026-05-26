import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import Reveal from '@/components/shared/reveal';
import { formatIDR } from '@/lib/currency';
import { formatOrderId, getOrderStatusLabel } from '@/lib/order-utils';
import { prisma } from '@/lib/prisma';

function getStatusBadgeClass(status: string) {
  const map: Record<string, string> = {
    COMPLETED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };

  return map[status] ?? 'bg-slate-100 text-slate-700 border-slate-200';
}

export default async function CompletedOrdersHistoryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return (
      <section className="rounded-2xl border border-[var(--color-brand-border)] bg-white p-6 text-center md:p-10">
        <h1 className="text-2xl font-bold text-[var(--color-brand-900)]">Riwayat Pesanan</h1>
        <p className="mt-2 text-sm text-slate-600">Silakan masuk untuk melihat riwayat pesanan yang sudah selesai.</p>
        <Link href="/login" className="mt-4 inline-flex rounded-full bg-[var(--color-brand-700)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-600)]">
          Masuk Sekarang
        </Link>
      </section>
    );
  }

  const completedOrders = await prisma.order.findMany({
    where: { userId: session.user.id, status: 'COMPLETED' },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <section className="space-y-4">
      <Reveal className="rounded-2xl border border-[var(--color-brand-border)] bg-white p-5 md:p-6">
        <h1 className="text-2xl font-bold text-[var(--color-brand-900)]">Riwayat Pesanan Selesai</h1>
        <p className="mt-1 text-sm text-slate-600">Semua pesanan yang statusnya sudah selesai akan muncul di sini.</p>
      </Reveal>

      {completedOrders.length === 0 ? (
        <Reveal>
          <article className="rounded-2xl border border-[var(--color-brand-border)] bg-white p-8 text-center text-slate-600">
            Belum ada pesanan selesai.
          </article>
        </Reveal>
      ) : null}

      <ul className="space-y-3">
        {completedOrders.map((order, index) => (
          <Reveal key={order.id} delayMs={70 + index * 50}>
            <li className="rounded-2xl border border-[var(--color-brand-border)] bg-white p-4 shadow-sm">
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div>
                  <div className="font-semibold text-[var(--color-brand-900)]">{formatOrderId(order.id)}</div>
                  <div className="text-xs text-slate-500">{order.id}</div>
                  <div className="mt-1 text-sm text-slate-500">
                    {order.customerName} • {formatIDR(order.total)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{new Date(order.updatedAt).toLocaleString('id-ID')}</div>
                </div>
                <div>
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClass(order.status)}`}>{getOrderStatusLabel(order.status)}</span>
                </div>
              </div>
              <div className="mt-3">
                <Link href="/orders" className="text-sm font-semibold text-[var(--color-brand-700)] hover:underline">
                  Lihat semua pesanan
                </Link>
              </div>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
