import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createWhatsAppCheckoutLink } from '@/lib/whatsapp';
import PaymentProofForm from '@/components/order/payment-proof-form';

export default async function OrderDetail({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const order = await prisma.order.findUnique({ where: { id: params.id }, include: { items: { include: { product: true } } } });

  if (!order) return <p>Order tidak ditemukan</p>;
  if (order.userId && order.userId !== session?.user?.id) return <p>Tidak berwenang</p>;

  const waUrl = createWhatsAppCheckoutLink({
    orderId: order.id,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerAddr: order.customerAddr,
    notes: order.notes ?? undefined,
    total: order.total,
    items: order.items.map((it) => ({ name: it.product?.name ?? '—', price: it.price, quantity: it.quantity })),
  });

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Detail Pesanan</h1>
      <div className="rounded border bg-white p-4">
        <div className="mb-2">ID: {order.id}</div>
        <div className="mb-2">Status: {order.status}</div>
        <div className="mb-2">Nama: {order.customerName}</div>
        <div className="mb-2">Alamat: {order.customerAddr}</div>
        <div className="mb-4">Total: Rp{order.total}</div>

        <h3 className="font-medium">Items</h3>
        <ul className="mb-4">
          {order.items.map((it) => (
            <li key={it.id} className="text-sm">
              {it.product?.name ?? '—'} × {it.quantity} — Rp{it.price}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex gap-2">
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="rounded bg-green-600 px-3 py-2 text-white">
            Hubungi Admin via WhatsApp
          </a>
          {/* @ts-expect-error Server -> Client */}
          <PaymentProofForm orderId={order.id} />
        </div>
      </div>
    </section>
  );
}
