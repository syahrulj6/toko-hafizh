import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Tidak berwenang' }, { status: 401 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: true } } },
  });

  if (!order) return NextResponse.json({ message: 'Order tidak ditemukan' }, { status: 404 });

  // only allow owner or admin
  if (order.userId && order.userId !== session.user.id && session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Tidak berwenang' }, { status: 401 });
  }

  return NextResponse.json(order);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Tidak berwenang' }, { status: 401 });
  }

  const body = await request.json();
  const { paymentMethod, paymentProof } = body as { paymentMethod?: string; paymentProof?: string };

  try {
    const order = await prisma.order.findUnique({ where: { id: params.id } });
    if (!order) return NextResponse.json({ message: 'Order tidak ditemukan' }, { status: 404 });
    if (order.userId && order.userId !== session.user.id) return NextResponse.json({ message: 'Tidak berwenang' }, { status: 401 });

    const data: any = {};
    if (paymentMethod !== undefined) data.paymentMethod = paymentMethod;
    if (paymentProof !== undefined) data.paymentProof = paymentProof;
    // when user uploads proof, mark as PAID? Keep as PAID only when admin verifies to avoid auto-accept.
    // We'll set status to PENDING until admin verifies.

    const updated = await prisma.order.update({ where: { id: params.id }, data });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal memperbarui bukti pembayaran' }, { status: 500 });
  }
}
