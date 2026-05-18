import { EventEmitter } from 'node:events';

type OrderUpdateEvent = {
  orderId: string;
  status?: string;
  trackingNumber?: string | null;
  updatedAt: string;
};

const globalForOrderEvents = globalThis as unknown as {
  orderEventsEmitter?: EventEmitter;
};

const emitter = globalForOrderEvents.orderEventsEmitter ?? new EventEmitter();
emitter.setMaxListeners(0);

if (!globalForOrderEvents.orderEventsEmitter) {
  globalForOrderEvents.orderEventsEmitter = emitter;
}

function getOrderEventName(orderId: string) {
  return `order-updated:${orderId}`;
}

export function publishOrderUpdate(event: OrderUpdateEvent) {
  emitter.emit(getOrderEventName(event.orderId), event);
}

export function subscribeOrderUpdate(orderId: string, callback: (event: OrderUpdateEvent) => void) {
  const eventName = getOrderEventName(orderId);
  emitter.on(eventName, callback);

  return () => {
    emitter.off(eventName, callback);
  };
}
