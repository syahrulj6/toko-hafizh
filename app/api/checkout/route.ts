import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkoutSchema } from '@/lib/validators/checkout';
import { createWhatsAppCheckoutLink } from '@/lib/whatsapp';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = (await request.json()) as unknown;
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Data tidak valid' }, { status: 400 });
    }

    const ids = parsed.data.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: ids }, isActive: true },
    });

    const productMap = new Map(products.map((product) => [product.id, product]));
    const lineItems = parsed.data.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error('Produk tidak ditemukan');
      }
      if (item.quantity > product.stock) {
        throw new Error(`Stok tidak mencukupi untuk ${product.name}`);
      }
      return {
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
      };
    });

    const total = lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id,
        customerName: parsed.data.customerName,
        customerPhone: parsed.data.customerPhone,
        customerAddr: parsed.data.customerAddr,
        notes: parsed.data.notes,
        total,
        items: {
          create: lineItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    await Promise.all(
      lineItems.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        }),
      ),
    );

    const waUrl = createWhatsAppCheckoutLink({
      orderId: order.id,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerAddr: order.customerAddr,
      notes: order.notes ?? undefined,
      total: order.total,
      items: lineItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    return NextResponse.json({ orderId: order.id, waUrl }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Pembayaran gagal';
    return NextResponse.json({ message }, { status: 400 });
  }
}
