import { v2 as cloudinary } from 'cloudinary';

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

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary belum dikonfigurasi');
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  const extension = getImageExtension(file);
  const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase() || 'image';
  const publicId = `${baseName}-${Date.now()}`;
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'toko-hafizh/products';
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: 'image',
        format: extension.replace('.', ''),
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(new Error('Gagal upload ke Cloudinary'));
          return;
        }

        resolve(result.secure_url);
      },
    );

    uploadStream.end(buffer);
  });
}
