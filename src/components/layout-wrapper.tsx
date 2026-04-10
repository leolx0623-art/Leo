'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { Footer } from '@/components/footer';

export function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}
