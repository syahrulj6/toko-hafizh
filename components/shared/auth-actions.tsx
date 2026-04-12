"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function AuthActions() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <Link href="/login" className="rounded-md bg-[#346739] px-3 py-1.5 text-white">
        Login
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-md border border-[#346739]/30 px-3 py-1.5 text-[#346739]"
    >
      Sign out
    </button>
  );
}
