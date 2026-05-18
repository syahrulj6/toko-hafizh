'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Ringkasan Admin', match: (pathname: string) => pathname === '/dashboard' },
  { href: '/dashboard/products', label: 'Kelola Produk', match: (pathname: string) => pathname.startsWith('/dashboard/products') },
  { href: '/dashboard/orders', label: 'Kelola Pesanan', match: (pathname: string) => pathname.startsWith('/dashboard/orders') },
  { href: '/', label: 'Lihat Toko', match: () => false },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex w-full gap-2 overflow-x-auto pb-1 text-sm sm:w-auto sm:flex-wrap sm:justify-end sm:overflow-visible sm:pb-0">
      {navItems.map((item) => {
        const isActive = item.match(pathname);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={`whitespace-nowrap rounded-full border px-3 py-2 transition ${
              isActive
                ? 'border-[#346739] bg-[#346739] text-white shadow-sm'
                : 'border-[#346739]/20 text-slate-700 hover:bg-[#346739]/10 hover:text-[#346739]'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
