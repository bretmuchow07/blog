import React from 'react';
import HudNavbar from '@/components/layout/HudNavbar';
import HudFooter from '@/components/layout/HudFooter';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HudNavbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>
      <HudFooter />
    </>
  );
}
