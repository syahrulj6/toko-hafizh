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

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-brand-border)] bg-[var(--color-brand-soft)] px-5 py-10 text-[var(--color-brand-900)] md:rounded-b-2xl md:px-10 md:py-12">
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
        <p>&copy; 2026 Toko Tas Hafizh. All rights reserved.</p>
        <div className="flex gap-5">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
