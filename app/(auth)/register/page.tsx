'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/lib/validators/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { message?: string } | null;
      setError(body?.message ?? 'Gagal mendaftar');
      return;
    }

    router.push('/login');
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-brand-900)]">Buat Akun</h1>
        <p className="mt-2 text-sm text-slate-600">Gabung dan mulai belanja dengan alur akun yang sederhana.</p>
      </div>
      <form className="space-y-3" onSubmit={onSubmit}>
        <Input placeholder="Nama" {...form.register('name')} />
        <Input placeholder="Email" {...form.register('email')} />
        <Input type="password" placeholder="Kata sandi" {...form.register('password')} />
        <Input placeholder="No. telepon" {...form.register('phone')} />
        <textarea className="min-h-24 w-full rounded-lg border border-[#346739]/30 p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#346739]/45" placeholder="Alamat" {...form.register('address')} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Sedang membuat akun...' : 'Buat akun'}
        </Button>
      </form>
      <p className="text-sm text-slate-600">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-semibold text-[#346739]">
          Masuk
        </Link>
      </p>
    </div>
  );
}
