import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatIDR } from "@/lib/currency";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-[#346739] to-[#4f8b57] px-6 py-10 text-white">
        <h1 className="text-3xl font-bold">E-Commerce Starter</h1>
        <p className="mt-2 text-sm text-white/90">
          Next.js App Router, Prisma, NextAuth, Zustand, Radix UI, RHF + Zod.
        </p>
        <Link
          href="/products"
          className="mt-4 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#346739]"
        >
          Browse Products
        </Link>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-[#1f4122]">Latest Products</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <article key={product.id} className="rounded-xl border border-[#346739]/20 bg-white p-4">
              <h3 className="font-semibold text-slate-800">{product.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{formatIDR(product.price)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
