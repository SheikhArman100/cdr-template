import { Layout14 } from '@/components/layouts/layout-14';
import RootProvider from '@/provider/root-provider';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootProvider>
      {children}
    </RootProvider>
  );
}
