'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export const Modal = Dialog.Root;
export const ModalTrigger = Dialog.Trigger;
export const ModalClose = Dialog.Close;

export function ModalContent({ title, description, children }: { title?: string; description?: string; children: React.ReactNode }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#346739]/20 bg-white p-6 shadow-xl focus:outline-none">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="space-y-1">
            {title ? <Dialog.Title className="text-lg font-semibold text-[#1f4122]">{title}</Dialog.Title> : null}
            {description ? <Dialog.Description className="text-sm text-slate-600">{description}</Dialog.Description> : null}
          </div>
          <Dialog.Close
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#346739] transition-colors hover:bg-[#edf4ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#346739]/45"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </Dialog.Close>
        </div>
        <div>{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
