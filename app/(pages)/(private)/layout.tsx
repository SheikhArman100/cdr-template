import { Layout14 } from '@/components/layouts/layout-14';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout14>
      {children}
    </Layout14>
  );
}
