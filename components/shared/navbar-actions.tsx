'use client';

import Link from 'next/link';
import { Menu, ShoppingBag } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { AuthActions } from '@/components/shared/auth-actions';
import { useOutsideClick } from '@/lib/hooks/use-outside-click';
import { useCartStore } from '@/store/cart-store';

type NavbarActionsProps = {
  isAdmin: boolean;
  hasOrders: boolean;
};

export function NavbarActions({ isAdmin, hasOrders }: NavbarActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const cartItemsCount = useCartStore((state) => state.totalItems());
  const canSeeAdminDashboard = isAdmin || session?.user?.role === 'ADMIN';
  const [hasOrdersState, setHasOrdersState] = useState(hasOrders);

  const menuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(menuRef, () => setMenuOpen(false), menuOpen);

  useEffect(() => {
    let active = true;

    if (status !== 'authenticated') {
      setHasOrdersState(false);
      return () => {
        active = false;
      };
    }

    const controller = new AbortController();

    (async () => {
      try {
        const response = await fetch('/api/orders', {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-store',
        });

        if (!response.ok) {
          if (active) setHasOrdersState(false);
          return;
        }

        const orders = (await response.json()) as Array<{ id: string }>;
        if (active) {
          setHasOrdersState(Array.isArray(orders) && orders.length > 0);
        }
      } catch {
        if (active) setHasOrdersState(false);
      }
    })();

    return () => {
      active = false;
      controller.abort();
    };
  }, [status]);

  return (
    <div className="ml-auto flex items-center justify-end gap-2 text-base text-black">
      <AuthActions />

      <Link href="/cart" aria-label="Open cart" className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-black transition hover:bg-[var(--color-brand-hover-bg)] hover:text-[var(--color-brand-700)]">
        <ShoppingBag size={18} strokeWidth={2.1} />
        {cartItemsCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-brand-700)] px-1 text-[10px] font-bold leading-none text-white">
            {cartItemsCount > 99 ? '99+' : cartItemsCount}
          </span>
        ) : null}
      </Link>

      {canSeeAdminDashboard ? (
        <Link
          href="/dashboard/products"
          className="ml-1 hidden rounded-full border border-black/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-black transition hover:border-[var(--color-brand-700)] hover:text-[var(--color-brand-700)] md:inline-flex"
        >
          Dasbor
        </Link>
      ) : null}

      {hasOrdersState ? (
        <Link
          href="/orders"
          className="ml-1 hidden rounded-full border border-[var(--color-brand-700)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-brand-700)] transition hover:bg-[var(--color-brand-700)] hover:text-white lg:inline-flex"
        >
          Pesanan Saya
        </Link>
      ) : null}

      <div ref={menuRef} className="relative lg:hidden">
        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-black transition hover:bg-[var(--color-brand-hover-bg)] hover:text-[var(--color-brand-700)]"
        >
          <Menu size={18} strokeWidth={2.1} />
        </button>

        {menuOpen ? (
          <div className="absolute right-0 top-11 z-40 w-44 rounded-xl border border-[var(--color-brand-border)] bg-white p-1.5 shadow-lg">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-black transition hover:bg-[var(--color-brand-hover-bg)] hover:text-[var(--color-brand-700)]"
            >
              Beranda
            </Link>
            <Link
              href="/products"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-black transition hover:bg-[var(--color-brand-hover-bg)] hover:text-[var(--color-brand-700)]"
            >
              Toko
            </Link>
            {hasOrdersState ? (
              <Link
                href="/orders"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg border border-[var(--color-brand-700)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-brand-700)] transition hover:bg-[var(--color-brand-700)] hover:text-white"
              >
                Pesanan Saya
              </Link>
            ) : null}
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-black transition hover:bg-[var(--color-brand-hover-bg)] hover:text-[var(--color-brand-700)]"
            >
              Tentang Kami
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
