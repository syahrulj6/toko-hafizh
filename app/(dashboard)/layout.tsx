import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-[#f7faf7]">
      <header className="border-b border-[#346739]/15 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold text-[#1f4122]">Dasbor Admin</h1>
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/dashboard" className="text-slate-700 hover:text-[#346739]">
              Ikhtisar
            </Link>
            <Link href="/dashboard/products" className="text-slate-700 hover:text-[#346739]">
              Produk
            </Link>
            <Link href="/" className="text-slate-700 hover:text-[#346739]">
              Toko
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
