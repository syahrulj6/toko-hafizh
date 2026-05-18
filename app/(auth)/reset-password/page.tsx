import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-600">Memuat halaman reset kata sandi...</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
