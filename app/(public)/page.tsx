import Image from 'next/image';
import Link from 'next/link';
import { formatIDR } from '@/lib/currency';

const categoryShowcase = [
  {
    name: 'Tas Tangan',
    caption: 'Koleksi Mewah',
    image: 'https://picsum.photos/seed/handbags-hero/900/1200',
    href: '/products',
  },
  {
    name: 'Ransel',
    caption: 'Untuk Aktivitas Harian',
    image: 'https://picsum.photos/seed/backpacks-card/900/700',
    href: '/products',
  },
  {
    name: 'Aksesori',
    caption: 'Detail Pelengkap',
    image: 'https://picsum.photos/seed/accessories-card/900/700',
    href: '/products',
  },
] as const;

const mockNewArrivals = [
  {
    id: 'mock-1',
    name: 'Tas Selempang Luxe',
    image: 'https://picsum.photos/seed/new-arrival-1/420/520',
    price: 420000,
    href: '/products',
  },
  {
    id: 'mock-2',
    name: 'Tote Kerja Aura',
    image: 'https://picsum.photos/seed/new-arrival-2/420/520',
    price: 580000,
    href: '/products',
  },
  {
    id: 'mock-3',
    name: 'Clutch Noir',
    image: 'https://picsum.photos/seed/new-arrival-3/420/520',
    price: 395000,
    href: '/products',
  },
  {
    id: 'mock-4',
    name: 'Sling Mini',
    image: 'https://picsum.photos/seed/new-arrival-4/420/520',
    price: 310000,
    href: '/products',
  },
] as const;

export default function HomePage() {
  return (
    <section className="space-y-10 pb-8 md:space-y-14 md:pb-12">
      <div className="relative overflow-hidden rounded-2xl bg-[#17120f] text-white md:rounded-3xl">
        <Image src="https://picsum.photos/seed/hero-bag-showcase/1600/900" alt="Placeholder hero untuk koleksi unggulan" fill priority className="object-cover object-center" sizes="(max-width: 768px) 100vw, 1200px" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/5" />

        <div className="relative z-10 flex min-h-[380px] flex-col justify-end px-6 py-8 md:min-h-[560px] md:px-12 md:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 md:text-xs">Koleksi Baru 2026</p>
          <h1 className="mt-2 max-w-md text-4xl font-extrabold leading-[0.95] tracking-tight md:text-6xl">Dibuat untuk Gaya Modern.</h1>
          <p className="mt-4 max-w-sm text-sm text-white/85 md:text-base">Visual hero masih placeholder untuk sekarang. Nanti bisa diganti dari gambar produk di admin.</p>
          <div className="mt-6">
            <Link href="/products" className="inline-flex items-center rounded-md bg-[var(--color-brand-700)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-600)]">
              Lihat Koleksi
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:grid-rows-2 md:gap-4">
        <Link href={categoryShowcase[0].href} className="group relative overflow-hidden rounded-2xl bg-[var(--color-brand-soft-alt)] md:row-span-2">
          <Image src={categoryShowcase[0].image} alt={`${categoryShowcase[0].name} placeholder image`} width={1000} height={1200} className="h-full min-h-[280px] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 text-white md:bottom-6 md:left-6">
            <p className="text-xl font-semibold md:text-2xl">{categoryShowcase[0].name}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-white/80">{categoryShowcase[0].caption}</p>
          </div>
        </Link>

        {categoryShowcase.slice(1).map((item) => (
          <Link key={item.name} href={item.href} className="group relative overflow-hidden rounded-2xl bg-[var(--color-brand-soft-alt)]">
            <Image src={item.image} alt={`Gambar placeholder ${item.name}`} width={1000} height={700} className="h-full min-h-[180px] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white md:bottom-5 md:left-5">
              <p className="text-lg font-semibold md:text-xl">{item.name}</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/80 md:text-xs">{item.caption}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl bg-[var(--color-brand-soft)] px-4 py-6 md:rounded-3xl md:px-6 md:py-8">
        <div className="mb-5 flex items-center justify-between md:mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-brand-900)] md:text-4xl">Produk Baru</h2>
          <Link href="/products" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-brand-muted)] hover:text-[var(--color-brand-900)]">
            Lihat Semua
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {mockNewArrivals.map((item) => (
            <Link key={item.id} href={item.href} className="group space-y-2">
              <div className="overflow-hidden rounded-md bg-white p-3 shadow-sm">
                <Image src={item.image} alt={`Gambar placeholder produk ${item.name}`} width={340} height={420} className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <h3 className="line-clamp-1 text-sm font-semibold text-[var(--color-brand-900)]">{item.name}</h3>
              <p className="text-xs text-[var(--color-brand-muted)]">{formatIDR(item.price)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
