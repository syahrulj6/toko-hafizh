import { prisma } from '@/lib/prisma';
import OrdersTable from '@/components/dashboard/orders-table';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Pesanan</h1>
      {/* @ts-expect-error Server -> Client serializable */}
      <OrdersTable orders={orders} />
    </section>
  );
}
