import favicon from '@/assets/images/favicon.png';
import type { Metadata } from 'next';

import './global.embedded.css';

export const metadata: Metadata = {
  title: 'Kadena SpireKey',
  description: 'Elevate your blockchain journey',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={favicon.src} sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}
