'use client';

import { useState } from 'react';

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

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const [local, setLocal] = useState<Record<string, Partial<Order>>>(() => ({}));

  async function save(orderId: string) {
    const delta = local[orderId];
    if (!delta) return;

    const res = await fetch('/api/dashboard/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, ...delta }),
    });

    if (!res.ok) {
      alert('Gagal menyimpan');
      return;
    }

    // reload page
    window.location.reload();
  }

  return (
    <div className="overflow-auto rounded border bg-white">
      <table className="w-full table-fixed text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2">Order</th>
            <th className="p-2">Customer</th>
            <th className="p-2">Items</th>
            <th className="p-2">Total</th>
            <th className="p-2">Status</th>
            <th className="p-2">Tracking</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t">
              <td className="p-2 align-top">
                {o.id}
                <div className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleString()}</div>
              </td>
              <td className="p-2 align-top">
                {o.customerName}
                <div className="text-xs">
                  {o.customerPhone}
                  <br />
                  {o.customerAddr}
                </div>
              </td>
              <td className="p-2 align-top">
                {o.items.map((it) => (
                  <div key={it.id} className="text-xs">
                    {it.product?.name ?? '—'} × {it.quantity}
                  </div>
                ))}
              </td>
              <td className="p-2 align-top">Rp {o.total}</td>
              <td className="p-2 align-top">
                <select defaultValue={o.status} onChange={(e) => setLocal((s) => ({ ...s, [o.id]: { ...(s[o.id] ?? {}), status: e.target.value } }))} className="border rounded px-2 py-1">
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELED">CANCELED</option>
                </select>
              </td>
              <td className="p-2 align-top">
                <input
                  defaultValue={o.trackingNumber ?? ''}
                  onChange={(e) => setLocal((s) => ({ ...s, [o.id]: { ...(s[o.id] ?? {}), trackingNumber: e.target.value } }))}
                  className="border rounded px-2 py-1 text-sm"
                  placeholder="Awb / tracking"
                />
              </td>
              <td className="p-2 align-top">
                <button className="rounded bg-green-600 px-3 py-1 text-white" onClick={() => save(o.id)}>
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
