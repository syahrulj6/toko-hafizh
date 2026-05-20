import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatIDR } from '@/lib/currency';

export const dynamic = 'force-dynamic';

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: { include: { product: true } },
      statusHistory: {
        include: { changedBy: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!order) notFound();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-[#1f4122]">Detail Pesanan</h1>

      <div className="rounded-xl border border-[#346739]/20 bg-white p-4">
        <h2 className="text-lg font-semibold">Informasi Pesanan</h2>
        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <p>ID: {order.id}</p>
          <p>Status: {order.status}</p>
          <p>Total: {formatIDR(order.total)}</p>
          <p>Nomor Resi: {order.trackingNumber ?? '-'}</p>
          <p>Metode Pembayaran: {order.paymentMethod ?? '-'}</p>
          <p>Pembeli Akun: {order.user?.name ?? order.user?.email ?? '-'}</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#346739]/20 bg-white p-4">
        <h2 className="text-lg font-semibold">Informasi Pelanggan</h2>
        <div className="mt-3 space-y-1 text-sm">
          <p>Nama: {order.customerName}</p>
          <p>Telepon: {order.customerPhone}</p>
          <p>Alamat: {order.customerAddr}</p>
          <p>Catatan: {order.notes ?? '-'}</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#346739]/20 bg-white p-4">
        <h2 className="text-lg font-semibold">Item Pesanan</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {order.items.map((item: { id: string; quantity: number; price: number; product?: { name: string } | null }) => (
            <li key={item.id} className="rounded border border-[#346739]/15 p-2">
              {(item.product?.name ?? 'Produk') + ' x ' + item.quantity + ' - ' + formatIDR(item.price)}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-[#346739]/20 bg-white p-4">
        <h2 className="text-lg font-semibold">Riwayat Status</h2>
        {order.statusHistory.length < 1 ? (
          <p className="mt-2 text-sm text-slate-500">Belum ada perubahan status.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {order.statusHistory.map((entry) => (
              <li key={entry.id} className="rounded border border-[#346739]/15 bg-[#f7faf7] p-2 text-sm">
                <p className="font-medium">{entry.oldStatus ? `${entry.oldStatus} -> ${entry.newStatus}` : entry.newStatus}</p>
                <p className="text-xs text-slate-500">
                  {new Date(entry.createdAt).toLocaleString('id-ID')} oleh {entry.changedBy?.name ?? entry.changedBy?.email ?? 'Admin'}
                </p>
                {entry.note ? <p className="mt-1 text-xs text-slate-600">Catatan: {entry.note}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

