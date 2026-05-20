import Image from 'next/image';
import Link from 'next/link';
import { Award, Gem, Hammer } from 'lucide-react';
import SiteFooter from '@/components/shared/site-footer';
import Image1 from '@/app/assets/images/tas-1.jpg';
import Image2 from '@/app/assets/images/tas-2.jpg';
import Image3 from '@/app/assets/images/tas-3.jpg';
import Image4 from '@/app/assets/images/tas-4.jpg';

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

export default function AboutPage() {
  return (
    <section className="-mx-4 space-y-0 pb-8 md:-mx-0 md:space-y-0 md:pb-12">
      <div className="relative overflow-hidden bg-[var(--color-brand-900)] text-white md:rounded-t-2xl">
        <Image src={Image1} alt="Tas kulit premium sebagai hero utama" fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 1200px" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/15" />

        <div className="relative z-10 mx-auto max-w-6xl px-5 py-14 md:px-10 md:py-20">
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-7xl md:leading-[1.02]">Menjadi toko tas lokal terpercaya dengan kualitas terbaik dan desain kekinian.</h1>
        </div>
      </div>

      <div className="bg-[var(--color-brand-soft)] px-5 py-14 md:px-10 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.95fr_1.35fr] md:gap-14">
          <div>
            <h2 className="text-4xl font-semibold leading-tight tracking-tight text-[var(--color-brand-900)] md:text-6xl md:leading-[1.02]">Warisan dalam setiap bahan, modern dalam setiap bentuk.</h2>
          </div>

          <div className="space-y-6 text-[15px] leading-8 text-slate-700">
            <p>
              Lahir dari toko kecil yang berakar dari Sidoarjo, kami membawa semangat kerja keras dan ketekunan dalam setiap produk. Seperti kota yang terus berkembang, Toko Tas Hafizh hadir dengan inovasi desain yang mengikuti zaman tanpa
              meninggalkan nilai kualitas.
            </p>
            <p>Kami percaya bahwa tas bukan hanya tentang membawa barang, tapi membawa cerita. Setiap desain di Toko Tas Hafizh menggabungkan fungsi dan gaya, agar setiap langkah Anda terasa lebih percaya diri dan bermakna.</p>
            <div className="pt-2">
              <span className="inline-block border-t border-[var(--color-brand-700)] pt-2 text-sm font-medium italic text-[var(--color-brand-900)]">Hafizh,</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-brand-soft)] px-5 pb-14 md:px-10 md:pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center md:mb-10">
            <h3 className="text-3xl font-semibold tracking-tight text-[var(--color-brand-900)] md:text-4xl">Dipandu Oleh Keunggulan</h3>
            <span className="mx-auto mt-3 block h-[2px] w-14 bg-[var(--color-brand-700)]" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {craftPillars.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <article
                  key={pillar.title}
                  className="rounded-xl border border-[var(--color-brand-border)] bg-white px-6 py-8 text-center shadow-[0_10px_24px_rgba(52,103,57,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(52,103,57,0.1)]"
                >
                  <Icon className="mx-auto h-5 w-5 text-[var(--color-brand-700)]" />
                  <h4 className="mt-4 text-lg font-semibold text-[var(--color-brand-900)]">{pillar.title}</h4>
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
            <Image src={Image2} alt="Tas kulit dijahit dengan detail" fill className="object-cover" sizes="(max-width: 768px) 100vw, 66vw" />
            <span className="absolute bottom-4 left-4 rounded-sm bg-white/95 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-brand-900)]">01. Precision</span>
          </article>

          <div className="grid gap-3">
            <article className="relative min-h-[245px] overflow-hidden rounded-md md:min-h-[342px]">
              <Image src={Image3} alt="Peralatan dan tas dalam proses produksi" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </article>
            <article className="relative min-h-[245px] overflow-hidden rounded-md md:min-h-[342px]">
              <Image src={Image4} alt="Tekstur tas kulit premium" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </article>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-6xl text-center text-base font-medium text-[var(--color-brand-900)] md:text-lg">Menjadi brand tas lokal terpercaya dengan kualitas terbaik dan desain kekinian.</p>
      </div>

      <div className="bg-[var(--color-brand-900)] px-5 py-16 text-white md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h3 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">Perjalanan Dimulai Dengan Tekat Yang Besar</h3>
          <span className="mx-auto mt-5 block h-px w-24 bg-white/35" />
          <div className="mt-8">
            <Link href="/products" className="inline-flex items-center rounded-md bg-white px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[var(--color-brand-900)] transition hover:bg-[#edf4ee]">
              Lihat Katalog
            </Link>
          </div>
        </div>
      </div>

      <SiteFooter />
    </section>
  );
}
