import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NavbarActions } from '../../components/shared/navbar-actions';

export default async function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  const hasOrders = session?.user?.id
    ? Boolean(
        await prisma.order.findFirst({
          where: { userId: session.user.id },
          select: { id: true },
        }),
      )
    : false;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(52,103,57,0.08),transparent_48%),radial-gradient(circle_at_top_left,rgba(31,65,34,0.06),transparent_34%),#f7faf7]">
      <header className="sticky top-0 z-30 border-b border-[var(--color-brand-border)] bg-white/92 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <Link href="/" className="text-[13px] font-black uppercase tracking-[0.08em] text-black transition hover:text-[var(--color-brand-700)] md:text-sm">
            Toko Hafizh
          </Link>

          <nav className="hidden items-center justify-center gap-8 text-xs font-semibold uppercase tracking-[0.14em] text-black lg:flex">
            <Link href="/" className="transition hover:text-[var(--color-brand-700)]">
              Beranda
            </Link>
            <Link href="/products" className="transition hover:text-[var(--color-brand-700)]">
              Belanja
            </Link>
            <Link href="/about" className="transition hover:text-[var(--color-brand-700)]">
              Tentang Kami
            </Link>
            {hasOrders ? (
              <Link href="/orders" className="rounded-full border border-[var(--color-brand-700)] px-3 py-1 text-[11px] tracking-[0.1em] text-[var(--color-brand-700)] transition hover:bg-[var(--color-brand-700)] hover:text-white">
                Pesanan Saya
              </Link>
            ) : null}
          </nav>

          <NavbarActions isAdmin={session?.user?.role === 'ADMIN'} hasOrders={hasOrders} />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:py-8">{children}</main>
    </div>
  );
}
