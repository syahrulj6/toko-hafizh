import Image from 'next/image';
import Link from 'next/link';
import SiteFooter from '@/components/shared/site-footer';
import { formatIDR } from '@/lib/currency';

// Import images from app/assets/images
import tas1 from '@/app/assets/images/tas-1.jpg';
import tas2 from '@/app/assets/images/tas-2.jpg';
import tas3 from '@/app/assets/images/tas-3.jpg';
import tas4 from '@/app/assets/images/tas-4.jpg';
import tas5 from '@/app/assets/images/tas-5.jpg';

const categoryShowcase = [
  {
    name: 'Tas Tangan',
    caption: 'Koleksi Mewah',
    image: tas1,
    href: '/products',
  },
  {
    name: 'Totebag',
    caption: 'Untuk Aktivitas Harian',
    image: tas2,
    href: '/products',
  },
  {
    name: 'Aksesori',
    caption: 'Detail Pelengkap',
    image: tas3,
    href: '/products',
  },
] as const;

const mockNewArrivals = [
  {
    id: 'mock-1',
    name: 'Tas Selempang Luxe',
    image: tas2,
    price: 420000,
    href: '/products',
  },
  {
    id: 'mock-2',
    name: 'Tote Kerja Aura',
    image: tas3,
    price: 580000,
    href: '/products',
  },
  {
    id: 'mock-3',
    name: 'Clutch Noir',
    image: tas4,
    price: 395000,
    href: '/products',
  },
  {
    id: 'mock-4',
    name: 'Sling Mini',
    image: tas5,
    price: 310000,
    href: '/products',
  },
] as const;

export default function HomePage() {
  return (
    <section className="space-y-8 px-4 pb-8 sm:space-y-10 sm:px-6 md:space-y-14 md:pb-12 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl bg-[#17120f] text-white md:rounded-3xl">
        <Image src={tas1} alt="Placeholder hero untuk koleksi unggulan" fill priority className="object-cover object-center" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/5" />

        <div className="relative z-10 flex min-h-[280px] flex-col justify-end px-4 py-6 sm:min-h-[360px] sm:px-8 sm:py-10 md:min-h-[560px] md:px-12 md:py-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 sm:text-xs md:text-xs">Koleksi Baru 2026</p>
          <h1 className="mt-2 max-w-md text-2xl font-extrabold leading-[0.95] tracking-tight sm:text-4xl md:text-6xl">Dibuat untuk Gaya Modern.</h1>
          <p className="mt-3 max-w-sm text-xs text-white/85 sm:mt-4 sm:text-sm md:text-base">Visual hero masih placeholder untuk sekarang. Nanti bisa diganti dari gambar produk di admin.</p>
          <div className="mt-4 sm:mt-6">
            <Link href="/products" className="inline-flex items-center rounded-md bg-[var(--color-brand-700)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--color-brand-600)] sm:px-5 sm:py-3 sm:text-sm">
              Lihat Koleksi
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-2 md:grid-rows-2 md:gap-4">
        <Link href={categoryShowcase[0].href} className="group relative h-[200px] overflow-hidden rounded-2xl bg-[var(--color-brand-soft-alt)] sm:h-[240px] md:row-span-2 md:h-[520px]">
          <Image src={categoryShowcase[0].image} alt={`${categoryShowcase[0].name} placeholder image`} width={500} height={500} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 text-white sm:bottom-4 sm:left-4 md:bottom-6 md:left-6">
            <p className="text-lg font-semibold sm:text-xl md:text-2xl">{categoryShowcase[0].name}</p>
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/80 sm:text-xs">{categoryShowcase[0].caption}</p>
          </div>
        </Link>

        {categoryShowcase.slice(1).map((item) => (
          <Link key={item.name} href={item.href} className="group relative h-[200px] overflow-hidden rounded-2xl bg-[var(--color-brand-soft-alt)] sm:h-[150px] md:h-[260px]">
            <Image src={item.image} alt={`Gambar placeholder ${item.name}`} width={1000} height={700} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-2 text-white sm:bottom-3 sm:left-3 md:bottom-5 md:left-5">
              <p className="text-base font-semibold sm:text-lg md:text-xl">{item.name}</p>
              <p className="text-[8px] uppercase tracking-[0.18em] text-white/80 sm:text-[10px] md:text-xs">{item.caption}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl bg-[var(--color-brand-soft)] px-3 py-4 sm:px-4 sm:py-6 md:rounded-3xl md:px-6 md:py-8">
        <div className="mb-4 flex items-center justify-between sm:mb-5 md:mb-6">
          <h2 className="text-xl font-bold tracking-tight text-[var(--color-brand-900)] sm:text-2xl md:text-4xl">Produk Baru</h2>
          <Link href="/products" className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--color-brand-muted)] hover:text-[var(--color-brand-900)] sm:text-[10px] md:text-xs">
            Lihat Semua
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6">
          {mockNewArrivals.map((item) => (
            <Link key={item.id} href={item.href} className="group space-y-1 sm:space-y-2">
              <div className="overflow-hidden rounded-md bg-white p-2 shadow-sm sm:p-3">
                <Image src={item.image} alt={`Gambar placeholder produk ${item.name}`} width={340} height={420} className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <h3 className="line-clamp-1 text-xs font-semibold text-[var(--color-brand-900)] sm:text-sm">{item.name}</h3>
              <p className="text-[10px] text-[var(--color-brand-muted)] sm:text-xs">{formatIDR(item.price)}</p>
            </Link>
          ))}
        </div>
      </div>

      <SiteFooter />
    </section>
  );
}
