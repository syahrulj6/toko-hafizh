import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function MyOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return (
      <section>
        <p>Silakan login untuk melihat pesanan Anda.</p>
      </section>
    );
  }

  const orders = await prisma.order.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: 'desc' } });

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Pesanan Saya</h1>
      <ul className="space-y-3">
        {orders.map((o) => (
          <li key={o.id} className="rounded border bg-white p-3">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{o.id}</div>
                <div className="text-sm text-slate-500">
                  {o.customerName} • Rp{o.total}
                </div>
              </div>
              <div className="text-sm">{o.status}</div>
            </div>
            <div className="mt-2">
              <Link href={`/orders/${o.id}`} className="text-sm text-indigo-600">
                Lihat detail
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
