import type { Metadata } from 'next';
import { Providers } from '@/app/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Toko Hafizh',
  description: 'Fullstack e-commerce app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body data-theme="emerald" className="min-h-full flex flex-col bg-[var(--color-app-bg)] text-[var(--color-app-foreground)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
