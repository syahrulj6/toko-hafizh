import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { productSchema } from '@/lib/validators/product';

type ProductRouteContext = {
  params: { id: string };
};

export async function GET(_request: Request, context: ProductRouteContext) {
  const { id } = context.params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    return NextResponse.json({ message: 'Produk tidak ditemukan' }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(request: Request, context: ProductRouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Tidak berwenang' }, { status: 401 });
  }

  const { id } = context.params;

  try {
    const body = (await request.json()) as unknown;
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: 'Data tidak valid' }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ message: 'Gagal memperbarui produk' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: ProductRouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Tidak berwenang' }, { status: 401 });
  }

  const { id } = context.params;

  try {
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: 'Gagal menghapus produk' }, { status: 500 });
  }
}
