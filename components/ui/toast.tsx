"use client";

import * as React from "react";
import * as Toast from "@radix-ui/react-toast";
import { X } from "lucide-react";

export const ToastProvider = Toast.Provider;
export const ToastViewport = React.forwardRef<
  React.ElementRef<typeof Toast.Viewport>,
  React.ComponentPropsWithoutRef<typeof Toast.Viewport>
>(({ className = "", ...props }, ref) => (
  <Toast.Viewport
    ref={ref}
    className={`fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:max-w-[420px] ${className}`}
    {...props}
  />
));

ToastViewport.displayName = Toast.Viewport.displayName;

export const ToastRoot = React.forwardRef<
  React.ElementRef<typeof Toast.Root>,
  React.ComponentPropsWithoutRef<typeof Toast.Root>
>(({ className = "", ...props }, ref) => (
  <Toast.Root
    ref={ref}
    className={`group relative overflow-hidden rounded-xl border border-[#346739]/25 bg-white p-4 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out ${className}`}
    {...props}
  />
));

ToastRoot.displayName = Toast.Root.displayName;

export const ToastTitle = React.forwardRef<
  React.ElementRef<typeof Toast.Title>,
  React.ComponentPropsWithoutRef<typeof Toast.Title>
>(({ className = "", ...props }, ref) => (
  <Toast.Title
    ref={ref}
    className={`text-sm font-semibold text-[#1f4122] ${className}`}
    {...props}
  />
));

ToastTitle.displayName = Toast.Title.displayName;

export const ToastDescription = React.forwardRef<
  React.ElementRef<typeof Toast.Description>,
  React.ComponentPropsWithoutRef<typeof Toast.Description>
>(({ className = "", ...props }, ref) => (
  <Toast.Description
    ref={ref}
    className={`mt-1 text-sm text-slate-600 ${className}`}
    {...props}
  />
));

ToastDescription.displayName = Toast.Description.displayName;

export const ToastAction = React.forwardRef<
  React.ElementRef<typeof Toast.Action>,
  React.ComponentPropsWithoutRef<typeof Toast.Action>
>(({ className = "", ...props }, ref) => (
  <Toast.Action
    ref={ref}
    className={`inline-flex h-8 items-center rounded-md border border-[#346739]/30 px-3 text-xs font-medium text-[#346739] transition-colors hover:bg-[#edf4ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#346739]/45 ${className}`}
    {...props}
  />
));

ToastAction.displayName = Toast.Action.displayName;

export const ToastClose = React.forwardRef<
  React.ElementRef<typeof Toast.Close>,
  React.ComponentPropsWithoutRef<typeof Toast.Close>
>(({ className = "", ...props }, ref) => (
  <Toast.Close
    ref={ref}
    className={`absolute right-2 top-2 rounded-md p-1 text-[#346739] transition-colors hover:bg-[#edf4ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#346739]/45 ${className}`}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </Toast.Close>
));

ToastClose.displayName = Toast.Close.displayName;
