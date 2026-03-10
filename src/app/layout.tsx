/**
 * Root layout component
 */

import type { Metadata } from 'next';
import { DashboardShell } from '@/components/layout/DashboardShell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Real-Time Analytics Dashboard',
  description: 'Professional real-time analytics dashboard with WebSocket updates',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className="antialiased">
        <DashboardShell>
          {children}
        </DashboardShell>
      </body>
    </html>
  );
}
