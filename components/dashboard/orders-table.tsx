'use client';

import Link from 'next/link';
import { useState } from 'react';
import { formatIDR } from '@/lib/currency';
import { formatOrderId, getOrderStatusLabel } from '@/lib/order-utils';
import { useToast } from '@/components/ui/toaster';

type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: { name: string } | null;
};

type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddr: string;
  total: number;
  status: string;
  trackingNumber?: string | null;
  items: OrderItem[];
  createdAt: string;
};

const statusOptions = [
  { value: 'PENDING', label: 'Menunggu Pembayaran' },
  { value: 'PAID', label: 'Sudah Dibayar' },
  { value: 'SHIPPED', label: 'Sedang Dikirim' },
  { value: 'COMPLETED', label: 'Selesai' },
  { value: 'CANCELED', label: 'Dibatalkan' },
];

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const { showToast } = useToast();
  const [rows, setRows] = useState<Order[]>(orders);
  const [local, setLocal] = useState<Record<string, Partial<Order>>>(() => ({}));
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function save(orderId: string) {
    const delta = local[orderId];
    const current = rows.find((order) => order.id === orderId);
    if (!delta || !current) return;

    const hasStatusChange = delta.status !== undefined && delta.status !== current.status;
    const hasTrackingChange = delta.trackingNumber !== undefined && (delta.trackingNumber ?? '') !== (current.trackingNumber ?? '');
    if (!hasStatusChange && !hasTrackingChange) return;

    setSavingId(orderId);

    const res = await fetch('/api/dashboard/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, ...delta }),
    });

    if (!res.ok) {
      // Fallback: beberapa kasus side-effect gagal, tetapi data inti sudah ter-update.
      const verify = await fetch(`/api/orders/${orderId}`, { cache: 'no-store' });
      if (verify.ok) {
        const latest = (await verify.json()) as { status?: string; trackingNumber?: string | null };
        const targetStatus = delta.status ?? current.status;
        const targetTracking = delta.trackingNumber ?? current.trackingNumber ?? '';
        const latestTracking = latest.trackingNumber ?? '';

        if (latest.status === targetStatus && latestTracking === targetTracking) {
          window.location.reload();
          return;
        }
      }

      let message = 'Gagal menyimpan perubahan';
      try {
        const errorBody = (await res.json()) as { message?: string };
        if (errorBody?.message) {
          message = errorBody.message;
        }
      } catch {
        // keep default message
      }

      alert(message);
      setSavingId(null);
      return;
    }

    const updated = (await res.json().catch(() => null)) as (Partial<Order> & { warning?: string }) | null;
    setRows((prev) =>
      prev.map((item) =>
        item.id === orderId
          ? {
              ...item,
              ...delta,
              ...(updated ?? {}),
            }
          : item,
      ),
    );
    setLocal((prev) => {
      const next = { ...prev };
      delete next[orderId];
      return next;
    });
    setSavingId(null);
    showToast({
      title: 'Perubahan tersimpan',
      description: updated?.warning ?? 'Status pesanan berhasil diperbarui.',
    });
  }

  async function removeOrder(orderId: string) {
    const confirmed = window.confirm('Yakin ingin menghapus pesanan ini? Tindakan ini tidak bisa dibatalkan.');
    if (!confirmed) return;

    setDeletingId(orderId);

    const res = await fetch('/api/dashboard/orders', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId }),
    });

    if (!res.ok) {
      alert('Gagal menghapus pesanan');
      setDeletingId(null);
      return;
    }

    window.location.reload();
  }

  return (
    <div className="rounded-xl border border-[#346739]/20 bg-white shadow-sm">
      {rows.length === 0 ? <div className="p-8 text-center text-slate-500">Belum ada pesanan masuk.</div> : null}

      <div className="space-y-3 p-3 md:hidden">
        {rows.map((o) =>
          (() => {
            const canDelete = o.status === 'CANCELED';
            const draft = local[o.id] ?? {};
            const hasStatusChange = draft.status !== undefined && draft.status !== o.status;
            const hasTrackingChange = draft.trackingNumber !== undefined && (draft.trackingNumber ?? '') !== (o.trackingNumber ?? '');
            const hasChanges = hasStatusChange || hasTrackingChange;
            return (
              <article key={o.id} className="rounded-xl border border-[#346739]/15 bg-[#fbfdfb] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="break-all text-sm font-semibold text-[#1f4122]">{formatOrderId(o.id)}</p>
                    <p className="text-[11px] text-slate-500">{o.id}</p>
                    <p className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleString('id-ID')}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#1f4122]">{formatIDR(o.total)}</p>
                </div>

                <div className="mt-3 space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Pelanggan</p>
                    <p className="font-medium text-slate-800">{o.customerName}</p>
                    <p className="text-xs text-slate-600">{o.customerPhone}</p>
                    <p className="text-xs text-slate-600">{o.customerAddr}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Item</p>
                    {o.items.map((it) => (
                      <p key={it.id} className="text-xs text-slate-700">
                        {(it.product?.name ?? '-') + ' x ' + it.quantity}
                      </p>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Status Saat Ini</p>
                    <p className="text-sm text-slate-700">{getOrderStatusLabel(o.status)}</p>
                  </div>
                  <div className="space-y-2">
                    <select
                      defaultValue={o.status}
                      onChange={(e) => setLocal((s) => ({ ...s, [o.id]: { ...(s[o.id] ?? {}), status: e.target.value } }))}
                      className="w-full rounded-lg border border-[#346739]/30 px-2 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#346739]/45"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <input
                      value={(local[o.id]?.trackingNumber as string | undefined) ?? o.trackingNumber ?? ''}
                      onChange={(e) => setLocal((s) => ({ ...s, [o.id]: { ...(s[o.id] ?? {}), trackingNumber: e.target.value } }))}
                      className="w-full rounded-lg border border-[#346739]/30 px-2 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#346739]/45"
                      placeholder="Isi nomor resi"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      className="rounded-lg bg-[#346739] px-3 py-1.5 text-sm text-white transition hover:bg-[#2d5b31] disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => save(o.id)}
                      disabled={savingId === o.id || deletingId === o.id || !hasChanges}
                      title={!hasChanges ? 'Belum ada perubahan' : 'Simpan perubahan'}
                    >
                      {savingId === o.id ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => removeOrder(o.id)}
                      disabled={deletingId === o.id || savingId === o.id || !canDelete}
                      title={!canDelete ? 'Hanya pesanan berstatus Dibatalkan yang bisa dihapus' : 'Hapus pesanan'}
                    >
                      {deletingId === o.id ? 'Menghapus...' : 'Hapus'}
                    </button>
                    <Link href={`/dashboard/orders/${o.id}`} className="text-sm font-medium text-[#346739] hover:underline">
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              </article>
            );
          })(),
        )}
      </div>

      <div className="hidden overflow-auto md:block">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-[#f4f8f4] text-slate-600">
            <tr>
              <th className="p-3 text-left">Pesanan</th>
              <th className="p-3 text-left">Pelanggan</th>
              <th className="p-3 text-left">Item</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Nomor Resi</th>
              <th className="p-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) =>
              (() => {
                const canDelete = o.status === 'CANCELED';
                const draft = local[o.id] ?? {};
                const hasStatusChange = draft.status !== undefined && draft.status !== o.status;
                const hasTrackingChange = draft.trackingNumber !== undefined && (draft.trackingNumber ?? '') !== (o.trackingNumber ?? '');
                const hasChanges = hasStatusChange || hasTrackingChange;
                return (
                  <tr key={o.id} className="border-t border-[#346739]/10 align-top">
                    <td className="p-3">
                      <p className="font-medium text-[#1f4122]">{formatOrderId(o.id)}</p>
                      <p className="text-[11px] text-slate-500">{o.id}</p>
                      <div className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleString('id-ID')}</div>
                    </td>

                    <td className="p-3">
                      <p className="font-medium text-slate-800">{o.customerName}</p>
                      <div className="text-xs text-slate-600">
                        {o.customerPhone}
                        <br />
                        {o.customerAddr}
                      </div>
                    </td>

                    <td className="p-3">
                      {o.items.map((it) => (
                        <div key={it.id} className="text-xs text-slate-700">
                          {(it.product?.name ?? '-') + ' x ' + it.quantity}
                        </div>
                      ))}
                    </td>

                    <td className="p-3 font-medium text-[#1f4122]">{formatIDR(o.total)}</td>

                    <td className="p-3">
                      <select
                        defaultValue={o.status}
                        onChange={(e) => setLocal((s) => ({ ...s, [o.id]: { ...(s[o.id] ?? {}), status: e.target.value } }))}
                        className="w-full rounded-lg border border-[#346739]/30 px-2 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#346739]/45"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-3">
                      <input
                        value={(local[o.id]?.trackingNumber as string | undefined) ?? o.trackingNumber ?? ''}
                        onChange={(e) => setLocal((s) => ({ ...s, [o.id]: { ...(s[o.id] ?? {}), trackingNumber: e.target.value } }))}
                        className="w-full rounded-lg border border-[#346739]/30 px-2 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#346739]/45"
                        placeholder="Isi nomor resi"
                      />
                    </td>

                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        <button
                          className="rounded-lg bg-[#346739] px-3 py-1.5 text-white transition hover:bg-[#2d5b31] disabled:cursor-not-allowed disabled:opacity-60"
                          onClick={() => save(o.id)}
                          disabled={savingId === o.id || deletingId === o.id || !hasChanges}
                          title={!hasChanges ? 'Belum ada perubahan' : 'Simpan perubahan'}
                        >
                          {savingId === o.id ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <button
                          className="rounded-lg border border-red-300 px-3 py-1.5 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          onClick={() => removeOrder(o.id)}
                          disabled={deletingId === o.id || savingId === o.id || !canDelete}
                          title={!canDelete ? 'Hanya pesanan berstatus Dibatalkan yang bisa dihapus' : 'Hapus pesanan'}
                        >
                          {deletingId === o.id ? 'Menghapus...' : 'Hapus'}
                        </button>
                        <Link href={`/dashboard/orders/${o.id}`} className="text-xs text-[#346739] hover:underline">
                          Detail
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })(),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
