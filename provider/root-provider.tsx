'use client';

import { ReactNode } from 'react';
import { Layout14 } from '@/components/layouts/layout-14';

export default function RootProvider({ children }: { children: ReactNode }) {
  return (
    <Layout14>
      {children}
    </Layout14>
  );
}
