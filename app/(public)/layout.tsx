import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AuthActions } from "@/components/shared/auth-actions";

export default async function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen">
      <header className="border-b border-[#346739]/15 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-bold text-[#1f4122]">
            Toko Hafizh
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/products" className="text-slate-700 hover:text-[#346739]">
              Products
            </Link>
            <Link href="/cart" className="text-slate-700 hover:text-[#346739]">
              Cart
            </Link>
            <Link href="/checkout" className="text-slate-700 hover:text-[#346739]">
              Checkout
            </Link>
            {session?.user?.role === "ADMIN" ? (
              <Link href="/dashboard/products" className="text-slate-700 hover:text-[#346739]">
                Dashboard
              </Link>
            ) : null}
            <AuthActions />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}

