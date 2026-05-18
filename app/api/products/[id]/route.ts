import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { productSchema } from '@/lib/validators/product';
import { saveProductImage } from '@/lib/product-image';

type ProductRouteContext = {
  params: { id: string };
};

function parseBoolean(value: FormDataEntryValue | null) {
  return value === 'true' || value === 'on' || value === '1';
}

async function buildProductPayload(request: Request, fallbackImage: string) {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const imageFile = formData.get('imageFile');
    const imageValue = typeof formData.get('image') === 'string' ? formData.get('image') : fallbackImage;

    const image = imageFile instanceof File && imageFile.size > 0 ? await saveProductImage(imageFile) : imageValue;

    return productSchema.safeParse({
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      image,
      price: formData.get('price'),
      stock: formData.get('stock'),
      isActive: parseBoolean(formData.get('isActive')),
    });
  }

  const body = (await request.json()) as unknown;
  return productSchema.safeParse(body);
}

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
    const existingProduct = await prisma.product.findUnique({ where: { id } });

    if (!existingProduct) {
      return NextResponse.json({ message: 'Produk tidak ditemukan' }, { status: 404 });
    }

    const parsed = await buildProductPayload(request, existingProduct.image);
    if (!parsed.success) {
      return NextResponse.json({ message: 'Data tidak valid' }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof Error && error.message === 'File gambar tidak valid') {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

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
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message.includes('Record to delete does not exist')) {
      return NextResponse.json({ message: 'Produk tidak ditemukan' }, { status: 404 });
    }
    if (message.includes('Foreign key constraint')) {
      return NextResponse.json({ message: 'Produk tidak bisa dihapus karena sudah dipakai pada pesanan.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Gagal menghapus produk' }, { status: 500 });
  }
}
