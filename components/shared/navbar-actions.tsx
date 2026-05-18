'use client';

import Link from 'next/link';
import { Menu, Search, ShoppingBag } from 'lucide-react';
import { useRef, useState } from 'react';
import { AuthActions } from '@/components/shared/auth-actions';
import { useOutsideClick } from '@/lib/hooks/use-outside-click';
import { useCartStore } from '@/store/cart-store';

type NavbarActionsProps = {
  isAdmin: boolean;
  hasOrders: boolean;
};

export function NavbarActions({ isAdmin, hasOrders }: NavbarActionsProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const cartItemsCount = useCartStore((state) => state.totalItems());

  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(searchRef, () => setSearchOpen(false), searchOpen);
  useOutsideClick(menuRef, () => setMenuOpen(false), menuOpen);

  return (
    <div className="ml-auto flex items-center justify-end gap-2 text-base text-black">
      <div ref={searchRef} className="relative">
        <button
          type="button"
          aria-label="Open search"
          aria-expanded={searchOpen}
          onClick={() => {
            setSearchOpen((prev) => !prev);
            setMenuOpen(false);
          }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-black transition hover:bg-[var(--color-brand-hover-bg)] hover:text-[var(--color-brand-700)]"
        >
          <Search size={18} strokeWidth={2.1} />
        </button>

        {searchOpen ? (
          <div className="absolute right-0 top-11 z-40 w-[min(85vw,20rem)] rounded-xl border border-[var(--color-brand-border)] bg-white p-2.5 shadow-lg">
            <form action="/products" method="get" className="flex items-center gap-2">
              <input type="search" name="q" placeholder="Cari produk..." className="h-9 w-full rounded-md border border-[var(--color-brand-border)] px-3 text-sm text-black outline-none transition focus:border-[var(--color-brand-700)]" />
              <button
                type="submit"
                className="inline-flex h-9 items-center justify-center rounded-md bg-[var(--color-brand-700)] px-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[var(--color-brand-600)]"
              >
                Cari
              </button>
            </form>
          </div>
        ) : null}
      </div>

      <AuthActions />

      <Link href="/cart" aria-label="Open cart" className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-black transition hover:bg-[var(--color-brand-hover-bg)] hover:text-[var(--color-brand-700)]">
        <ShoppingBag size={18} strokeWidth={2.1} />
        {cartItemsCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-brand-700)] px-1 text-[10px] font-bold leading-none text-white">
            {cartItemsCount > 99 ? '99+' : cartItemsCount}
          </span>
        ) : null}
      </Link>

      {isAdmin ? (
        <Link
          href="/dashboard/products"
          className="ml-1 hidden rounded-full border border-black/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-black transition hover:border-[var(--color-brand-700)] hover:text-[var(--color-brand-700)] md:inline-flex"
        >
          Dasbor
        </Link>
      ) : null}

      <div ref={menuRef} className="relative lg:hidden">
        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          onClick={() => {
            setMenuOpen((prev) => !prev);
            setSearchOpen(false);
          }}
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
            {hasOrders ? (
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
