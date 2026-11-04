import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://blog.bretmuchoni.dev'),
  title: {
    default: "Bret Muchoni — Writing",
    template: "%s — Bret Muchoni",
  },
  description:
    'Articles, notes, and essays on software, design, and whatever else is on my mind by Bret Muchoni.',
  authors: [{ name: 'Bret Muchoni', url: 'https://bretmuchoni.dev' }],
  creator: 'Bret Muchoni',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://blog.bretmuchoni.dev',
    title: "Bret Muchoni — Writing",
    description:
      'Articles, notes, and essays on software, design, and whatever else is on my mind.',
    siteName: "Bret Muchoni's Blog",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Bret Muchoni — Writing",
    description:
      'Articles, notes, and essays on software, design, and whatever else is on my mind.',
    creator: '@bretmuchoni',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="flex flex-col min-h-screen bg-[var(--canvas-bg)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}
