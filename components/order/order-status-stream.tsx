'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toaster';
import { getOrderStatusLabel } from '@/lib/order-utils';

type OrderUpdatedPayload = {
  orderId: string;
  status?: string;
  trackingNumber?: string | null;
  updatedAt: string;
};

export default function OrderStatusStream({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const source = new EventSource(`/api/orders/${orderId}/events`);

    const onOrderUpdated = (event: Event) => {
      const messageEvent = event as MessageEvent<string>;
      let payload: OrderUpdatedPayload | null = null;

      try {
        payload = JSON.parse(messageEvent.data) as OrderUpdatedPayload;
      } catch {
        payload = null;
      }

      const details = [payload?.status ? `Status: ${getOrderStatusLabel(payload.status)}` : null, payload?.trackingNumber ? `Resi: ${payload.trackingNumber}` : null].filter(Boolean).join(' | ');

      showToast({
        title: 'Status pesanan diperbarui',
        description: details || 'Ada pembaruan pada pesanan Anda.',
      });

      router.refresh();
    };

    source.addEventListener('order-updated', onOrderUpdated);

    return () => {
      source.removeEventListener('order-updated', onOrderUpdated);
      source.close();
    };
  }, [orderId, router, showToast]);

  return null;
}
