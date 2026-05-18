'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validators/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type ForgotPasswordResponse = {
  message?: string;
  resetUrl?: string;
};

export function ForgotPasswordForm() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [devResetUrl, setDevResetUrl] = useState('');

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError('');
    setSuccess('');
    setDevResetUrl('');

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    const body = (await res.json().catch(() => null)) as ForgotPasswordResponse | null;

    if (!res.ok) {
      setError(body?.message ?? 'Gagal memproses permintaan');
      return;
    }

    setSuccess(body?.message ?? 'Jika email terdaftar, tautan reset kata sandi telah dibuat.');
    if (body?.resetUrl) {
      setDevResetUrl(body.resetUrl);
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-brand-900)]">Lupa Kata Sandi</h1>
        <p className="mt-2 text-sm text-slate-600">Masukkan email akun Anda untuk membuat tautan reset kata sandi.</p>
      </div>
      <form className="space-y-3" onSubmit={onSubmit}>
        <Input placeholder="Email" {...form.register('email')} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
        {devResetUrl ? (
          <p className="break-all text-xs text-slate-600">
            Link reset (mode development):{' '}
            <a href={devResetUrl} className="font-medium text-[#346739] underline">
              {devResetUrl}
            </a>
          </p>
        ) : null}
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Memproses...' : 'Kirim Tautan Reset'}
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
