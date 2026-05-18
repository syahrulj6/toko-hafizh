'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validators/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>('');

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError('');
    const callbackUrl = searchParams.get('callbackUrl') ?? '/products';
    const result = await signIn('credentials', {
      ...values,
      callbackUrl,
      redirect: false,
    });

    if (result?.error) {
      setError('Email atau kata sandi tidak valid');
      return;
    }

    router.push(result?.url ?? callbackUrl);
    router.refresh();
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-brand-900)]">Masuk</h1>
        <p className="mt-2 text-sm text-slate-600">Masuk dengan akun Anda.</p>
      </div>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <Input placeholder="Email" {...form.register('email')} />
        <Input type="password" placeholder="Kata sandi" {...form.register('password')} />
        <div className="text-right">
          <Link href="/forgot-password" className="text-xs font-medium text-[#346739] hover:underline">
            Lupa kata sandi?
          </Link>
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Sedang masuk...' : 'Masuk'}
        </Button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Belum punya akun?{' '}
        <Link href="/register" className="font-semibold text-[#346739]">
          Daftar
        </Link>
      </p>
    </div>
  );
}
