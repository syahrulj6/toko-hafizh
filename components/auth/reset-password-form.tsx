'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { resetPasswordSchema } from '@/lib/validators/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type ResetFormInput = {
  password: string;
};

type ResetPasswordResponse = {
  message?: string;
};

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [error, setError] = useState('');

  const form = useForm<ResetFormInput>({
    defaultValues: { password: '' },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError('');

    const parsed = resetPasswordSchema.safeParse({ token, password: values.password });
    if (!parsed.success) {
      setError('Token reset tidak valid atau kata sandi terlalu pendek');
      return;
    }

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    });

    const body = (await res.json().catch(() => null)) as ResetPasswordResponse | null;

    if (!res.ok) {
      setError(body?.message ?? 'Gagal mereset kata sandi');
      return;
    }

    router.push('/login');
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-brand-900)]">Atur Ulang Kata Sandi</h1>
        <p className="mt-2 text-sm text-slate-600">Masukkan kata sandi baru untuk akun Anda.</p>
      </div>
      <form className="space-y-3" onSubmit={onSubmit}>
        <Input type="password" placeholder="Kata sandi baru" {...form.register('password', { required: true, minLength: 6 })} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || !token}>
          {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
        </Button>
      </form>
      <p className="text-sm text-slate-600">
        Kembali ke halaman{' '}
        <Link href="/login" className="font-semibold text-[#346739]">
          Masuk
        </Link>
      </p>
    </div>
  );
}
