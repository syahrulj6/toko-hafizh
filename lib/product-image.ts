import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

const PRODUCT_IMAGE_DIR = path.join(process.cwd(), 'public', 'uploads', 'products');

function getImageExtension(file: File) {
  const nameExtension = path.extname(file.name).toLowerCase();
  if (nameExtension) {
    return nameExtension;
  }

  const mimeToExtension: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/avif': '.avif',
    'image/svg+xml': '.svg',
  };

  return mimeToExtension[file.type] ?? '.png';
}

export async function saveProductImage(file: File) {
  const isImageFile = file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(file.name);

  if (!isImageFile || file.size < 1) {
    throw new Error('File gambar tidak valid');
  }

  await mkdir(PRODUCT_IMAGE_DIR, { recursive: true });

  const extension = getImageExtension(file);
  const fileName = `${randomUUID()}${extension}`;
  const filePath = path.join(PRODUCT_IMAGE_DIR, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return `/uploads/products/${fileName}`;
}
