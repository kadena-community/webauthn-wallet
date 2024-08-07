'use client';

import dynamic from 'next/dynamic';
import './order.css';

const Connection = dynamic(
  () => import('./Connection').then((mod) => mod.ConnectionProvider),
  {
    ssr: false,
  },
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Connection>{children}</Connection>;
}
