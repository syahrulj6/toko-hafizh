import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatIDR } from '@/lib/currency';
import { formatOrderId, getOrderStatusLabel } from '@/lib/order-utils';

export default async function AdminCompletedOrdersHistoryPage() {
  const orders = await prisma.order.findMany({
    where: { status: 'COMPLETED' },
    orderBy: { updatedAt: 'desc' },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[#1f4122]">Riwayat Pesanan Selesai</h1>
        <p className="text-sm text-slate-600">Daftar semua pesanan dengan status selesai.</p>
      </div>

      {orders.length === 0 ? (
        <article className="rounded-xl border border-[#346739]/20 bg-white p-6 text-sm text-slate-600">
          Belum ada pesanan dengan status selesai.
        </article>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#346739]/20 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-[#f5faf5] text-left text-slate-600">
              <tr>
                <th className="p-3">Pesanan</th>
                <th className="p-3">Pelanggan</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Selesai Pada</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-[#346739]/10">
                  <td className="p-3">
                    <p className="font-medium text-[#1f4122]">{formatOrderId(order.id)}</p>
                    <p className="text-xs text-slate-500">{order.id}</p>
                  </td>
                  <td className="p-3">
                    <p className="text-slate-700">{order.customerName}</p>
                    <p className="text-xs text-slate-500">{order.user?.email ?? '-'}</p>
                  </td>
                  <td className="p-3 font-medium text-[#1f4122]">{formatIDR(order.total)}</td>
                  <td className="p-3">
                    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">{new Date(order.updatedAt).toLocaleString('id-ID')}</td>
                  <td className="p-3">
                    <Link href={`/dashboard/orders/${order.id}`} className="font-medium text-[#346739] hover:underline">
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
