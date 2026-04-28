import Image from 'next/image';
import Link from 'next/link';
import { Award, Gem, Hammer } from 'lucide-react';

const craftPillars = [
  {
    title: 'Keahlian',
    description: 'Dibuat dengan keahlian terbaik untuk menghasilkan tas yang rapi, kuat, dan berkelas.',
    icon: Hammer,
  },
  {
    title: 'Bahan dan Kualitas',
    description: 'Bahan premium, kualitas terjamin, siap digunakan dalam jangka panjang tanpa mengurangi kenyamanan.',
    icon: Award,
  },
  {
    title: 'Keanggunan Fungsional',
    description: 'Perpaduan estetika dan fungsi untuk menemani aktivitas harian dengan detail yang elegan.',
    icon: Gem,
  },
] as const;

const footerColumns = [
  {
    title: 'Toko',
    links: ['Handbags', 'Backpacks', 'Accessories'],
  },
  {
    title: 'Informasi',
    links: ['Pelayanan Pelanggan', 'Kebijakan Pengiriman', 'Pembayaran'],
  },
  {
    title: 'Media',
    links: ['Instagram', 'Facebook', 'TikTok'],
  },
] as const;

export default function AboutPage() {
  return (
    <section className="-mx-4 space-y-0 pb-8 md:-mx-0 md:space-y-0 md:pb-12">
      <div className="relative overflow-hidden bg-[var(--color-brand-900)] text-white md:rounded-t-2xl">
        <Image src="https://picsum.photos/seed/hero-bag-showcase/1800/1200" alt="Tas kulit premium sebagai hero utama" fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 1200px" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10" />

        <div className="relative z-10 mx-auto max-w-6xl px-5 py-14 md:px-10 md:py-20">
          <h1 className="max-w-4xl text-4xl font-black leading-[0.95] tracking-tight md:text-7xl">Menjadi brand tas lokal terpercaya dengan kualitas terbaik dan desain kekinian.</h1>
        </div>
      </div>

      <div className="bg-[var(--color-brand-soft)] px-5 py-14 md:px-10 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.95fr_1.35fr] md:gap-14">
          <div>
            <h2 className="text-4xl font-black leading-[0.95] tracking-tight text-[var(--color-brand-900)] md:text-6xl">Warisan dalam setiap bahan, modern dalam setiap bentuk.</h2>
          </div>

          <div className="space-y-6 text-[15px] leading-8 text-slate-600">
            <p>
              Lahir dari toko kecil yang berakar dari Sidoarjo, kami membawa semangat kerja keras dan ketekunan dalam setiap produk. Seperti kota yang terus berkembang, Toko Tas Hafizh hadir dengan inovasi desain yang mengikuti zaman tanpa
              meninggalkan nilai kualitas.
            </p>
            <p>Kami percaya bahwa tas bukan hanya tentang membawa barang, tapi membawa cerita. Setiap desain di Toko Tas Hafizh menggabungkan fungsi dan gaya, agar setiap langkah Anda terasa lebih percaya diri dan bermakna.</p>
            <div className="pt-2">
              <span className="inline-block border-t border-[var(--color-brand-700)] pt-2 text-sm font-semibold italic text-[var(--color-brand-900)]">Hafizh,</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-brand-soft)] px-5 pb-14 md:px-10 md:pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center md:mb-10">
            <h3 className="text-3xl font-black tracking-tight text-[var(--color-brand-900)] md:text-4xl">Dipandu Oleh Keunggulan</h3>
            <span className="mx-auto mt-3 block h-[2px] w-14 bg-[var(--color-brand-700)]" />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {craftPillars.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <article key={pillar.title} className="rounded-md bg-white px-6 py-8 text-center shadow-[0_10px_24px_rgba(52,103,57,0.08)]">
                  <Icon className="mx-auto h-5 w-5 text-[var(--color-brand-700)]" />
                  <h4 className="mt-4 text-lg font-bold text-[var(--color-brand-900)]">{pillar.title}</h4>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{pillar.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-brand-soft)] px-5 pb-14 md:px-10 md:pb-16">
        <div className="mx-auto grid max-w-6xl gap-3 md:grid-cols-[2fr_1fr]">
          <article className="relative min-h-[500px] overflow-hidden rounded-md md:min-h-[700px]">
            <Image src="https://picsum.photos/seed/bag-stitch/1200/1600" alt="Tas kulit dijahit dengan detail" fill className="object-cover" sizes="(max-width: 768px) 100vw, 66vw" />
            <span className="absolute bottom-4 left-4 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-brand-900)]">01. Precision</span>
          </article>

          <div className="grid gap-3">
            <article className="relative min-h-[245px] overflow-hidden rounded-md md:min-h-[342px]">
              <Image src="https://picsum.photos/seed/bag-tools/900/1200" alt="Peralatan dan tas dalam proses produksi" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </article>
            <article className="relative min-h-[245px] overflow-hidden rounded-md md:min-h-[342px]">
              <Image src="https://picsum.photos/seed/bag-texture/900/1200" alt="Tekstur tas kulit premium" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </article>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-6xl text-center text-base font-semibold text-[var(--color-brand-900)] md:text-lg">Menjadi brand tas lokal terpercaya dengan kualitas terbaik dan desain kekinian.</p>
      </div>

      <div className="bg-[var(--color-brand-900)] px-5 py-16 text-white md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h3 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">Perjalanan Dimulai Dengan Tekat Yang Besar</h3>
          <span className="mx-auto mt-5 block h-px w-24 bg-white/35" />
          <div className="mt-8">
            <Link href="/products" className="inline-flex items-center rounded-md bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-brand-900)] transition hover:bg-[#edf4ee]">
              Lihat Katalog
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-[var(--color-brand-border)] bg-[var(--color-brand-soft)] px-5 py-10 text-[var(--color-brand-900)] md:px-10 md:py-12 md:rounded-b-2xl">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_2fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.12em]">Toko Tas Hafizh</p>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600">Elevating the everyday through timeless design and meticulous Indonesian craftsmanship.</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">{column.title}</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {column.links.map((link) => (
                    <li key={link}>{link}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-3 border-t border-[var(--color-brand-border)] pt-4 text-[11px] uppercase tracking-[0.12em] text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Toko Tas Hafizh. All rights reserved.</p>
          <div className="flex gap-5">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </section>
  );
}
