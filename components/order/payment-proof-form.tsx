'use client';

import { useState } from 'react';

export default function PaymentProofForm({ orderId }: { orderId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [method, setMethod] = useState('Bank Transfer');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return alert('Pilih file bukti pembayaran');
    setLoading(true);

    const form = new FormData();
    form.append('file', file);

    const upload = await fetch('/api/uploads/payment-proof', { method: 'POST', body: form });
    if (!upload.ok) return alert('Gagal mengunggah');
    const data = await upload.json();

    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethod: method, paymentProof: data.url }),
    });

    setLoading(false);
    if (!res.ok) return alert('Gagal menyimpan bukti');

    alert('Bukti pembayaran dikirim. Tunggu verifikasi admin.');
    window.location.reload();
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-2">
      <div>
        <label className="block text-sm">Metode Pembayaran</label>
        <select value={method} onChange={(e) => setMethod(e.target.value)} className="mt-1 rounded border px-2 py-1">
          <option>Bank Transfer</option>
          <option>GoPay</option>
          <option>OVO</option>
        </select>
      </div>
      <div>
        <label className="block text-sm">Bukti Pembayaran (gambar)</label>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-1" />
      </div>
      <div>
        <button type="submit" disabled={loading} className="rounded bg-indigo-600 px-3 py-1 text-white">
          {loading ? 'Mengunggah...' : 'Kirim Bukti'}
        </button>
      </div>
    </form>
  );
}
