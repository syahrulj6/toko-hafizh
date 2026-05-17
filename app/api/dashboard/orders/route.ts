import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendWhatsAppMessage } from '@/lib/notifications';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Tidak berwenang' }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(orders);
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Tidak berwenang' }, { status: 401 });
  }

  const body = await request.json();
  const { id, status, trackingNumber, paymentMethod, paymentProof } = body as {
    id: string;
    status?: string;
    trackingNumber?: string | null;
    paymentMethod?: string | null;
    paymentProof?: string | null;
  };

  if (!id) return NextResponse.json({ message: 'Order id is required' }, { status: 400 });

  const data: any = {};
  if (status) data.status = status;
  if (trackingNumber !== undefined) data.trackingNumber = trackingNumber;
  if (paymentMethod !== undefined) data.paymentMethod = paymentMethod;
  if (paymentProof !== undefined) data.paymentProof = paymentProof;

  try {
    const previous = await prisma.order.findUnique({ where: { id } });
    const order = await prisma.order.update({ where: { id }, data });

    // notify customer if status changed or tracking added
    const statusChanged = status && previous && previous.status !== status;
    const trackingAdded = trackingNumber && trackingNumber !== previous?.trackingNumber;

    if (statusChanged || trackingAdded) {
      const msgParts = [`Status pesanan Anda (ID: ${order.id}) telah diperbarui.`];
      if (statusChanged) msgParts.push(`Status: ${status}`);
      if (trackingAdded) msgParts.push(`No. Resi: ${trackingNumber}`);
      msgParts.push('Terima kasih.');

      try {
        await sendWhatsAppMessage(order.customerPhone, msgParts.join('\n'));
      } catch (_) {
        // ignore send errors
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal memperbarui order' }, { status: 500 });
  }
}
