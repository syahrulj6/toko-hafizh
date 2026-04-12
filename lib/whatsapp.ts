import { formatIDR } from "@/lib/currency";

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
  const lines = [
    "Halo Admin, saya ingin checkout pesanan berikut:",
    "",
    `Order ID: ${order.orderId}`,
    `Nama: ${order.customerName}`,
    `No. HP: ${order.customerPhone}`,
    `Alamat: ${order.customerAddr}`,
    order.notes ? `Catatan: ${order.notes}` : null,
    "",
    "Detail Pesanan:",
    ...order.items.map(
      (item, index) =>
        `${index + 1}. ${item.name} x${item.quantity} = ${formatIDR(item.price * item.quantity)}`,
    ),
    "",
    `Total: ${formatIDR(order.total)}`,
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join("\n"));
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6280000000000";

  return `https://wa.me/${phone}?text=${text}`;
}
