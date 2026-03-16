import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prometheus 2026 | Landing',
  description: 'The ultimate tech event - Prometheus 2026',
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
