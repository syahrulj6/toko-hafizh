import { formatIDR } from '@/lib/currency';

type WhatsAppItem = {
  name: string;
  price: number;
  quantity: number;
};

type WhatsAppOrderPayload = {
  customerName: string;
  customerPhone: string;
  customerAddr: string;
  notes?: string;
  items: WhatsAppItem[];
  total: number;
  orderId: string;
};

export function createWhatsAppCheckoutLink(order: WhatsAppOrderPayload): string {
  const timestamp = new Date().toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta',
  });

  const lines = [
    'Halo Admin Toko Tas Hafizh, saya ingin checkout pesanan berikut:',
    '',
    `Order ID: ${order.orderId}`,
    `Waktu Checkout: ${timestamp}`,
    `Nama: ${order.customerName}`,
    `No. HP: ${order.customerPhone}`,
    `Alamat: ${order.customerAddr}`,
    order.notes ? `Catatan: ${order.notes}` : null,
    '',
    'Detail Pesanan:',
    ...order.items.map((item, index) => `${index + 1}. ${item.name} | ${item.quantity} x ${formatIDR(item.price)} = ${formatIDR(item.price * item.quantity)}`),
    '',
    `Total Belanja: ${formatIDR(order.total)}`,
    '',
    'Mohon konfirmasi pesanan saya. Terima kasih.',
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join('\n'));
  const phone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '6280000000000').replace(/\D/g, '');

  return `https://wa.me/${phone}?text=${text}`;
}
