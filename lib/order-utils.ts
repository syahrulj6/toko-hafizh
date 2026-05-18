export function formatOrderId(orderId: string) {
  const compact = orderId.replace(/-/g, '').toUpperCase();
  return `ORD-${compact.slice(0, 6)}-${compact.slice(-4)}`;
}

export function getOrderStatusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: 'Menunggu Pembayaran',
    PAID: 'Sudah Dibayar',
    SHIPPED: 'Sedang Dikirim',
    COMPLETED: 'Selesai',
    CANCELED: 'Dibatalkan',
  };

  return labels[status] ?? status;
}
