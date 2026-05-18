import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { OrderStatus } from '@prisma/client';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendWhatsAppMessage } from '@/lib/notifications';
import { publishOrderUpdate } from '@/lib/order-events';

const updateOrderSchema = z.object({
  id: z.string().min(1),
  status: z.nativeEnum(OrderStatus).optional(),
  trackingNumber: z.string().nullable().optional(),
  paymentMethod: z.string().nullable().optional(),
  paymentProof: z.string().nullable().optional(),
  note: z.string().max(500).optional(),
});

const deleteOrderSchema = z.object({
  id: z.string().min(1),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Tidak berwenang' }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: 'desc' },
  });

  try {
    const trackingRows = (await prisma.$queryRaw`SELECT "id", "trackingNumber" FROM "Order"`) as Array<{
      id: string;
      trackingNumber: string | null;
    }>;
    const trackingMap = new Map(trackingRows.map((row) => [row.id, row.trackingNumber]));

    const merged = orders.map((order) => ({
      ...order,
      trackingNumber: trackingMap.has(order.id) ? trackingMap.get(order.id) ?? null : (order as { trackingNumber?: string | null }).trackingNumber ?? null,
    }));

    return NextResponse.json(merged);
  } catch {
    return NextResponse.json(orders);
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Tidak berwenang' }, { status: 401 });
  }

  const body = (await request.json()) as unknown;
  const parsed = updateOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: 'Data tidak valid' }, { status: 400 });
  }

  const { id, status, trackingNumber, paymentMethod, paymentProof, note } = parsed.data;

  const data: {
    status?: OrderStatus;
    trackingNumber?: string | null;
    paymentMethod?: string | null;
    paymentProof?: string | null;
  } = {};
  if (status) data.status = status;
  if (trackingNumber !== undefined) data.trackingNumber = trackingNumber;
  if (paymentMethod !== undefined) data.paymentMethod = paymentMethod;
  if (paymentProof !== undefined) data.paymentProof = paymentProof;

  const previous = await prisma.order.findUnique({ where: { id } });
  if (!previous) {
    return NextResponse.json({ message: 'Order tidak ditemukan' }, { status: 404 });
  }

  let order;
  let droppedUnknownArg: string | null = null;
  const mutableData: {
    status?: OrderStatus;
    trackingNumber?: string | null;
    paymentMethod?: string | null;
    paymentProof?: string | null;
  } = { ...data };

  try {
    order = await prisma.order.update({ where: { id }, data: mutableData });
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : 'Gagal memperbarui order';
    const unknownArg = /Unknown argument `([^`]+)`/.exec(rawMessage)?.[1];

    // Fallback compatibility for outdated Prisma Client schema.
    if (unknownArg && unknownArg in mutableData) {
      droppedUnknownArg = unknownArg;
      delete mutableData[unknownArg as keyof typeof mutableData];

      try {
        order = await prisma.order.update({ where: { id }, data: mutableData });
      } catch (retryError) {
        const retryMessage = retryError instanceof Error ? retryError.message : 'Gagal memperbarui order';
        return NextResponse.json({ message: retryMessage }, { status: 500 });
      }
    } else {
      return NextResponse.json({ message: rawMessage }, { status: 500 });
    }
  }

  // If Prisma Client schema is outdated, persist tracking number via raw SQL fallback.
  if (trackingNumber !== undefined && (droppedUnknownArg === 'trackingNumber' || !('trackingNumber' in mutableData))) {
    try {
      await prisma.$executeRaw`UPDATE "Order" SET "trackingNumber" = ${trackingNumber} WHERE "id" = ${id}`;
      // keep response aligned with the latest intended value
      order = { ...order, trackingNumber } as typeof order;
    } catch {
      // ignore fallback write error; main update already succeeded
    }
  }

  // notify customer if status changed or tracking added
  const statusChanged = status && previous.status !== status;
  const trackingAdded = trackingNumber && previous.trackingNumber !== undefined && trackingNumber !== previous.trackingNumber;

  if (statusChanged) {
    try {
      await prisma.orderStatusHistory.create({
        data: {
          orderId: order.id,
          oldStatus: previous.status,
          newStatus: status,
          note,
          changedById: session.user.id,
        },
      });
    } catch {
      // ignore history write errors so main update stays successful
    }
  }

  if (statusChanged || trackingAdded) {
    try {
      publishOrderUpdate({
        orderId: order.id,
        status: order.status,
        trackingNumber: order.trackingNumber,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      // ignore event publish errors
    }

    const msgParts = [`Status pesanan Anda (ID: ${order.id}) telah diperbarui.`];
    if (statusChanged) msgParts.push(`Status: ${status}`);
    if (trackingAdded) msgParts.push(`No. Resi: ${trackingNumber}`);
    msgParts.push('Terima kasih.');

    try {
      await sendWhatsAppMessage(order.customerPhone, msgParts.join('\n'));
    } catch {
      // ignore send errors
    }
  }

  return NextResponse.json(order);
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Tidak berwenang' }, { status: 401 });
  }

  const body = (await request.json()) as unknown;
  const parsed = deleteOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: 'Data tidak valid' }, { status: 400 });
  }

  const { id } = parsed.data;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { select: { productId: true, quantity: true } } },
    });

    if (!order) {
      return NextResponse.json({ message: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    if (order.status !== OrderStatus.CANCELED) {
      return NextResponse.json({ message: 'Hanya pesanan berstatus DIBATALKAN yang boleh dihapus' }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      await tx.order.delete({ where: { id: order.id } });
    });

    return NextResponse.json({ message: 'Pesanan berhasil dihapus' });
  } catch {
    return NextResponse.json({ message: 'Gagal menghapus pesanan' }, { status: 500 });
  }
}
