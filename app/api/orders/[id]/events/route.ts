import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { subscribeOrderUpdate } from '@/lib/order-events';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response('Tidak berwenang', { status: 401 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    select: { id: true, userId: true },
  });

  if (!order) {
    return new Response('Order tidak ditemukan', { status: 404 });
  }

  const isOwner = order.userId && order.userId === session.user.id;
  const isAdmin = session.user.role === 'ADMIN';

  if (!isOwner && !isAdmin) {
    return new Response('Tidak berwenang', { status: 401 });
  }

  let cleanup: (() => void) | null = null;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const encoder = new TextEncoder();

      const send = (eventName: string, payload: unknown) => {
        const data = JSON.stringify(payload);
        controller.enqueue(encoder.encode(`event: ${eventName}\ndata: ${data}\n\n`));
      };

      send('connected', { ok: true, orderId: order.id });

      const unsubscribe = subscribeOrderUpdate(order.id, (event) => {
        send('order-updated', event);
      });

      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(': keep-alive\n\n'));
      }, 20000);

      cleanup = () => {
        clearInterval(keepAlive);
        unsubscribe();
      };
    },
    cancel() {
      cleanup?.();
      cleanup = null;
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
