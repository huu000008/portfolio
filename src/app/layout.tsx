import type { Metadata } from 'next';
import '@/assets/styles/globals.css';
import { ThemeScript } from '@/components/ThemeScript';
import Header from '@/components/layout/Header';
import Providers from './providers';
import { Toaster } from '@/components/ui/sonner';
import QuickAction from '@/components/layout/QuickAction';
import { pretendard } from '@/assets/fonts/fonts';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Next.js 15 with custom theme system',
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning className={pretendard.variable}>
      <head>
        <ThemeScript />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'My App',
              description: 'Next.js 15 with custom theme system',
              url: 'https://myapp.com',
            }),
          }}
        />
      </head>
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          {modal}
          <QuickAction />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
