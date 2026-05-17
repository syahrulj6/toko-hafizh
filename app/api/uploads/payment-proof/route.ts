import { NextResponse } from 'next/server';
import { saveProductImage } from '@/lib/product-image';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') ?? '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ message: 'Content-Type must be multipart/form-data' }, { status: 400 });
    }

    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ message: 'File tidak ditemukan' }, { status: 400 });
    }

    const url = await saveProductImage(file);
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Gagal upload' }, { status: 500 });
  }
}
