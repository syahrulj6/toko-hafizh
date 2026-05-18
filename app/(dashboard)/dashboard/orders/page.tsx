import { prisma } from '@/lib/prisma';
import OrdersTable from '@/components/dashboard/orders-table';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: 'desc' },
  });
  const trackingRows = (await prisma.$queryRaw`SELECT "id", "trackingNumber" FROM "Order"`) as Array<{
    id: string;
    trackingNumber: string | null;
  }>;
  const trackingMap = new Map(trackingRows.map((row) => [row.id, row.trackingNumber]));
  const ordersWithTracking = orders.map((order) => ({
    ...order,
    trackingNumber: trackingMap.has(order.id) ? trackingMap.get(order.id) ?? null : (order as { trackingNumber?: string | null }).trackingNumber ?? null,
  }));

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[#1f4122]">Manajemen Pesanan</h1>
        <p className="text-sm text-slate-600">Perbarui status pesanan, isi nomor resi, dan buka detail transaksi.</p>
      </div>
      {/* @ts-expect-error Server -> Client serializable */}
      <OrdersTable orders={ordersWithTracking} />
    </section>
  );
}

