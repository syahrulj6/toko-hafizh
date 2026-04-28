'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { productSchema, type ProductInput } from '@/lib/validators/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ProductFormProps = {
  mode: 'create' | 'edit';
  product?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    price: number;
    stock: number;
    isActive: boolean;
  };
};

export function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(product?.image ?? '');
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? '',
      slug: product?.slug ?? '',
      description: product?.description ?? '',
      image: product?.image ?? '',
      price: product?.price ?? 0,
      stock: product?.stock ?? 0,
      isActive: product?.isActive ?? true,
    },
  });

  useEffect(() => {
    const fallbackImage = product?.image ?? '';
    setSelectedImage(null);
    setPreviewUrl(fallbackImage);
    form.setValue('image', fallbackImage, {
      shouldValidate: true,
      shouldDirty: false,
    });

    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  }, [form, product?.image]);

  useEffect(() => {
    if (!selectedImage) {
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const endpoint = mode === 'create' ? '/api/products' : `/api/products/${product?.id}`;
  const method = mode === 'create' ? 'POST' : 'PUT';

  const mutation = useMutation({
    mutationFn: async (values: FormData) => {
      const res = await fetch(endpoint, {
        method,
        body: values,
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? 'Gagal menyimpan produk');
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      router.refresh();

      if (mode === 'create') {
        form.reset({
          name: '',
          slug: '',
          description: '',
          image: '',
          price: 0,
          stock: 0,
          isActive: true,
        });
        setSelectedImage(null);
        setPreviewUrl('');
        if (imageInputRef.current) {
          imageInputRef.current.value = '';
        }
      } else {
        setSelectedImage(null);
        setPreviewUrl(product?.image ?? '');
        form.setValue('image', product?.image ?? '', {
          shouldValidate: true,
          shouldDirty: false,
        });
        if (imageInputRef.current) {
          imageInputRef.current.value = '';
        }
      }
    },
    onError: (mutationError) => {
      setError(mutationError.message);
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError('');

    const payload = new FormData();
    payload.set('name', values.name);
    payload.set('slug', values.slug);
    payload.set('description', values.description);
    payload.set('image', values.image);
    payload.set('price', String(values.price));
    payload.set('stock', String(values.stock));
    payload.set('isActive', String(values.isActive));

    if (selectedImage) {
      payload.set('imageFile', selectedImage);
    }

    await mutation.mutateAsync(payload);
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedImage(file);

    const nextImageValue = file ? file.name : (product?.image ?? '');
    form.setValue('image', nextImageValue, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(product?.image ?? '');
    form.setValue('image', product?.image ?? '', {
      shouldValidate: true,
      shouldDirty: false,
    });

    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-[#346739]/20 bg-white p-4">
      <h2 className="text-lg font-semibold text-[#1f4122]">{mode === 'create' ? 'Buat Produk' : 'Ubah Produk'}</h2>

      <input type="hidden" {...form.register('image')} />

      <div className="space-y-2 text-center">
        <p className="text-sm font-medium text-slate-700">Gambar Produk</p>
        <label className="group relative mx-auto block w-full max-w-[420px] cursor-pointer overflow-hidden rounded-xl border border-dashed border-[#346739]/30 bg-[#f7faf7]">
          <input ref={imageInputRef} type="file" accept="image/*" className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" onChange={handleImageChange} />

          <div className="relative h-44 w-full">
            {previewUrl ? (
              <Image src={previewUrl} alt={product?.name ?? 'Pratinjau gambar produk'} fill className="object-cover" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-1.5 px-4 text-center text-slate-500">
                <ImageIcon className="h-8 w-8 text-[#346739]" />
                <p className="text-xs font-medium">Klik untuk upload gambar dari perangkat</p>
                <p className="text-[11px] text-slate-400">PNG, JPG, WEBP, GIF</p>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 text-white opacity-0 transition group-hover:opacity-100">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">Unggah Gambar</p>
                <p className="mt-1 text-xs font-medium">{selectedImage ? selectedImage.name : 'Klik untuk memilih file'}</p>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-white/15 backdrop-blur-sm">
                <Upload className="h-4 w-4" />
              </div>
            </div>

            {selectedImage ? (
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute right-2 top-2 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#1f4122] shadow-md transition hover:bg-white"
                aria-label="Hapus gambar terpilih"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        </label>
        <p className="mx-auto max-w-[420px] text-xs text-slate-500">Gambar akan diambil dari file lokal pengguna dan disimpan ke penyimpanan aplikasi.</p>
      </div>

      <Input placeholder="Nama" {...form.register('name')} />
      <Input placeholder="Slug" {...form.register('slug')} />
      <Input type="number" placeholder="Harga" {...form.register('price', { valueAsNumber: true })} />
      <Input type="number" placeholder="Stok" {...form.register('stock', { valueAsNumber: true })} />
      <textarea className="min-h-28 w-full rounded-lg border border-[#346739]/30 p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#346739]/45" placeholder="Deskripsi" {...form.register('description')} />
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" {...form.register('isActive')} />
        Produk aktif
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={mutation.isPending || form.formState.isSubmitting}>
        {mutation.isPending || form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
      </Button>
    </form>
  );
}
