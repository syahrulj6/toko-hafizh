import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { productSchema } from '@/lib/validators/product';
import { saveProductImage } from '@/lib/product-image';

function parseBoolean(value: FormDataEntryValue | null) {
  return value === 'true' || value === 'on' || value === '1';
}

async function buildProductPayload(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const imageFile = formData.get('imageFile');
    const fallbackImage = typeof formData.get('image') === 'string' ? formData.get('image') : '';

    const image = imageFile instanceof File && imageFile.size > 0 ? await saveProductImage(imageFile) : fallbackImage;

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

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Tidak berwenang' }, { status: 401 });
  }

  try {
    const parsed = await buildProductPayload(request);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Data tidak valid' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: parsed.data,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'File gambar tidak valid') {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Kesalahan server internal' }, { status: 500 });
  }
}
