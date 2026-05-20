import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { formatIDR } from '@/lib/currency';
import { formatOrderId, getOrderStatusLabel } from '@/lib/order-utils';
import { prisma } from '@/lib/prisma';
import OrderStatusStream from '@/components/order/order-status-stream';
import Reveal from '@/components/shared/reveal';

function getStatusBadgeClass(status: string) {
  const map: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
    PAID: 'bg-blue-100 text-blue-700 border-blue-200',
    SHIPPED: 'bg-violet-100 text-violet-700 border-violet-200',
    COMPLETED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    CANCELED: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  return map[status] ?? 'bg-slate-100 text-slate-700 border-slate-200';
}

export default async function OrderDetail({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: { include: { product: true } },
    },
  });

  if (!order) return <p>Order tidak ditemukan</p>;
  if (order.userId && order.userId !== session?.user?.id) return <p>Tidak berwenang</p>;

  const trackingRows = (await prisma.$queryRaw`SELECT "id", "trackingNumber" FROM "Order" WHERE "id" = ${order.id} LIMIT 1`) as Array<{
    id: string;
    trackingNumber: string | null;
  }>;
  const trackingNumber = trackingRows[0]?.trackingNumber ?? null;

  const statusHistory = (await prisma.$queryRaw`
    SELECT
      osh."id",
      osh."oldStatus",
      osh."newStatus",
      osh."note",
      osh."createdAt",
      u."name" as "changedByName",
      u."email" as "changedByEmail"
    FROM "OrderStatusHistory" osh
    LEFT JOIN "User" u ON u."id" = osh."changedById"
    WHERE osh."orderId" = ${order.id}
    ORDER BY osh."createdAt" DESC
  `) as Array<{
    id: string;
    oldStatus: string | null;
    newStatus: string;
    note: string | null;
    createdAt: Date;
    changedByName: string | null;
    changedByEmail: string | null;
  }>;

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = order.shipping ?? 0;

  return (
    <section className="space-y-4">
      <OrderStatusStream orderId={order.id} />
      <Reveal>
        <div>
        <h1 className="text-2xl font-bold text-[#1f4122]">Detail Pesanan</h1>
        <p className="text-sm text-slate-600">Pantau status pesanan dan lihat rincian item Anda.</p>
        </div>
      </Reveal>

      <div className="grid gap-4">
        <Reveal>
          <article className="rounded-xl border border-[#346739]/20 bg-white p-4">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Nomor Pesanan</p>
            <p className="text-lg font-semibold text-[#1f4122]">{formatOrderId(order.id)}</p>
            <p className="text-xs text-slate-500">Ref: {order.id}</p>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-[#346739]/15 bg-[#f8fbf8] p-3">
              <p className="text-xs text-slate-500">Status Pesanan</p>
              <p className={`mt-1 inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(order.status)}`}>{getOrderStatusLabel(order.status)}</p>
            </div>
            <div className="rounded-lg border border-[#346739]/15 bg-[#f8fbf8] p-3">
              <p className="text-xs text-slate-500">Nomor Resi</p>
              <p className="mt-1 font-medium text-[#1f4122]">{trackingNumber ?? '-'}</p>
            </div>
            <div className="rounded-lg border border-[#346739]/15 bg-[#f8fbf8] p-3">
              <p className="text-xs text-slate-500">Metode Pembayaran</p>
              <p className="mt-1 font-medium text-[#1f4122]">{order.paymentMethod ?? '-'}</p>
            </div>
            <div className="rounded-lg border border-[#346739]/15 bg-[#f8fbf8] p-3">
              <p className="text-xs text-slate-500">Total Belanja</p>
              <p className="mt-1 font-medium text-[#1f4122]">{formatIDR(order.total)}</p>
            </div>
          </div>

          <div className="mb-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-[#346739]/15 p-3">
              <p className="text-xs text-slate-500">Informasi Penerima</p>
              <p className="mt-1 text-sm text-slate-700">Nama: {order.customerName}</p>
              <p className="text-sm text-slate-700">Telepon: {order.customerPhone}</p>
              <p className="text-sm text-slate-700">Alamat: {order.customerAddr}</p>
              <p className="text-sm text-slate-700">Catatan: {order.notes ?? '-'}</p>
            </div>
            <div className="rounded-lg border border-[#346739]/15 p-3">
              <p className="text-xs text-slate-500">Rincian Biaya</p>
              <div className="mt-2 space-y-1 text-sm text-slate-700">
                <p>Subtotal Item: {formatIDR(subtotal)}</p>
                <p>Biaya Pengiriman: {formatIDR(shipping)}</p>
                <p className="pt-1 font-semibold text-[#1f4122]">Total: {formatIDR(order.total)}</p>
              </div>
            </div>
          </div>

          <h3 className="font-medium text-[#1f4122]">Item Pesanan</h3>
          <ul className="mt-2 space-y-2">
            {order.items.map((it) => (
              <li key={it.id} className="rounded-lg border border-[#346739]/15 p-3 text-sm text-slate-700">
                {(it.product?.name ?? '-') + ' x ' + it.quantity + ' - ' + formatIDR(it.price * it.quantity)}
                <p className="text-xs text-slate-500">Harga satuan: {formatIDR(it.price)}</p>
              </li>
            ))}
          </ul>
          </article>
        </Reveal>

        <Reveal delayMs={120}>
          <article className="rounded-xl border border-[#346739]/20 bg-white p-4">
          <h3 className="font-medium text-[#1f4122]">Riwayat Status</h3>
          {statusHistory.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">Belum ada riwayat status.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {statusHistory.map((entry) => (
                <li key={entry.id} className="rounded-lg border border-[#346739]/15 bg-[#f8fbf8] p-3 text-sm">
                  <p className="font-medium text-[#1f4122]">
                    {entry.oldStatus ? `${getOrderStatusLabel(entry.oldStatus)} -> ${getOrderStatusLabel(entry.newStatus)}` : getOrderStatusLabel(entry.newStatus)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(entry.createdAt).toLocaleString('id-ID')} oleh {entry.changedByName ?? entry.changedByEmail ?? 'Admin'}
                  </p>
                  {entry.note ? <p className="mt-1 text-xs text-slate-600">Catatan: {entry.note}</p> : null}
                </li>
              ))}
            </ul>
          )}
          </article>
        </Reveal>
      </div>
    </section>
  );
}

