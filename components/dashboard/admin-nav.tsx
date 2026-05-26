'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useOutsideClick } from '@/lib/hooks/use-outside-click';

const navItems = [
  { href: '/dashboard', label: 'Ringkasan Admin', match: (pathname: string) => pathname === '/dashboard' },
  {
    href: '/dashboard/products',
    label: 'Kelola Produk',
    match: (pathname: string) => pathname === '/dashboard/products' || (pathname.startsWith('/dashboard/products/') && pathname !== '/dashboard/products/new'),
  },

  {
    href: '/dashboard/orders',
    label: 'Kelola Pesanan',
    match: (pathname: string) => pathname.startsWith('/dashboard/orders') && pathname !== '/dashboard/orders/history',
  },
  { href: '/dashboard/orders/history', label: 'Riwayat Selesai', match: (pathname: string) => pathname === '/dashboard/orders/history' },
  { href: '/', label: 'Lihat Toko', match: () => false },
];

export default function AdminNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useOutsideClick(navRef, () => setIsOpen(false), isOpen);

  return (
    <div ref={navRef} className="w-full sm:w-auto">
      <div className="flex items-center justify-end sm:hidden">
        <button
          type="button"
          aria-label="Toggle admin menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full border border-[#346739]/25 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#1f4122] transition hover:bg-[#f2f8f2]"
        >
          {isOpen ? <X size={14} /> : <Menu size={14} />}
          Menu Admin
        </button>
      </div>

      <nav className={`${isOpen ? 'mt-3 grid grid-cols-1 gap-2' : 'hidden'} sm:mt-0 sm:flex sm:flex-wrap sm:justify-end sm:gap-2`}>
        {navItems.map((item) => {
          const isActive = item.match(pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              aria-current={isActive ? 'page' : undefined}
              className={`rounded-full border px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.12em] transition sm:text-[11px] ${
                isActive ? 'border-[#346739] bg-[#346739] text-white shadow-sm' : 'border-[#346739]/20 bg-white text-slate-700 hover:bg-[#346739]/10 hover:text-[#346739]'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
