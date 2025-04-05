import type { Metadata } from 'next';
import '@/styles/globals.scss';
import { ThemeScript } from '@/components/ThemeScript';
import { Header } from '@/components/layout/Header';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Next.js 15 with custom theme system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <Header />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
