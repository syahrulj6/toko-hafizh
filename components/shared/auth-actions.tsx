'use client';

import Link from 'next/link';
import { CircleUserRound } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function AuthActions() {
  const { data: session } = useSession();
  const displayName = session?.user?.name?.trim() || 'Tamu';
  const displayEmail = session?.user?.email?.trim() || 'Silakan masuk untuk melanjutkan';

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="User menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-black transition hover:bg-[var(--color-brand-hover-bg)] hover:text-[var(--color-brand-700)] data-[state=open]:bg-[var(--color-brand-hover-bg)] data-[state=open]:text-[var(--color-brand-700)]"
        >
          <CircleUserRound size={18} strokeWidth={2.1} />
          <span className="sr-only">Open user menu</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={8} className="z-50 min-w-56 rounded-xl border border-[var(--color-brand-border)] bg-white p-1.5 shadow-lg outline-none">
          <div className="rounded-lg px-2.5 py-2">
            <p className="text-xs font-semibold text-black">{displayName}</p>
            <p className="mt-0.5 text-xs text-black/60">{displayEmail}</p>
          </div>

          <DropdownMenu.Separator className="my-1 h-px bg-[var(--color-brand-border)]" />

          {session?.user ? (
            <DropdownMenu.Item
              onSelect={(event) => {
                event.preventDefault();
                void signOut({ callbackUrl: '/' });
              }}
              className="cursor-pointer rounded-md px-2.5 py-2 text-xs font-medium text-black outline-none transition hover:bg-[var(--color-brand-hover-bg)] hover:text-[var(--color-brand-700)] focus:bg-[var(--color-brand-hover-bg)]"
            >
              Keluar
            </DropdownMenu.Item>
          ) : (
            <DropdownMenu.Item asChild>
              <Link
                href="/login"
                className="block rounded-md px-2.5 py-2 text-xs font-medium text-black outline-none transition hover:bg-[var(--color-brand-hover-bg)] hover:text-[var(--color-brand-700)] focus:bg-[var(--color-brand-hover-bg)]"
              >
                Masuk
              </Link>
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
