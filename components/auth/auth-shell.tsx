import Image from 'next/image';
import Link from 'next/link';

export function AuthShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-screen bg-[var(--color-app-bg)] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--color-brand-border)] bg-white shadow-[0_20px_60px_rgba(31,65,34,0.12)] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="flex items-center justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <div className="w-full max-w-md">
            <Link href="/" className="inline-flex items-center text-sm font-black uppercase tracking-[0.22em] text-[var(--color-brand-700)]">
              Toko Hafizh
            </Link>
            <div className="mt-10">{children}</div>
          </div>
        </div>

        <div className="relative hidden overflow-hidden bg-[#d9c6ae] lg:block">
          <Image src="https://picsum.photos/seed/toko-hafizh-auth-chair/1400/1800" alt="Visual kursi placeholder untuk layout autentikasi" fill priority sizes="(max-width: 1024px) 0vw, 50vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(31,65,34,0.08)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#8b6b4e]/85 via-[#8b6b4e]/55 to-transparent" />
          <div className="absolute left-10 top-10 max-w-xs">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">Toko Hafizh</p>
            <p className="mt-3 text-2xl font-semibold leading-tight text-white">Pengalaman belanja yang sederhana, tenang, dan fokus.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
