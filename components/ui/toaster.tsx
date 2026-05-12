'use client';

import * as React from 'react';
import Link from 'next/link';
import { ToastAction, ToastClose, ToastDescription, ToastProvider, ToastRoot, ToastTitle, ToastViewport } from '@/components/ui/toast';

type ToastMessage = {
  id: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  duration?: number;
};

type ToastContextValue = {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

function buildToastId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ToastProviderShell({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = React.useCallback(
    (toast: Omit<ToastMessage, 'id'>) => {
      const id = buildToastId();
      const duration = toast.duration ?? 3200;

      setToasts((current) => [...current, { ...toast, id, duration }]);

      window.setTimeout(() => {
        removeToast(id);
      }, duration + 200);
    },
    [removeToast],
  );

  const value = React.useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastProvider swipeDirection="right">
      <ToastContext.Provider value={value}>
        {children}
        {toasts.map((toast) => (
          <ToastRoot
            key={toast.id}
            defaultOpen
            duration={toast.duration}
            onOpenChange={(open) => {
              if (!open) removeToast(toast.id);
            }}
          >
            <div className="pr-7">
              <ToastTitle>{toast.title}</ToastTitle>
              {toast.description ? <ToastDescription>{toast.description}</ToastDescription> : null}
              {toast.actionLabel && toast.actionHref ? (
                <div className="mt-3">
                  <ToastAction asChild altText={toast.actionLabel}>
                    <Link href={toast.actionHref}>{toast.actionLabel}</Link>
                  </ToastAction>
                </div>
              ) : null}
            </div>
            <ToastClose />
          </ToastRoot>
        ))}
        <ToastViewport />
      </ToastContext.Provider>
    </ToastProvider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProviderShell');
  }

  return context;
}
