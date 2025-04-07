import type { Metadata } from 'next';
import '@/styles/globals.scss';
import { ThemeScript } from '@/components/ThemeScript';
import { Header } from '@/components/layout/Header';
import Providers from './providers';
import { ToastContainer } from '@/components/ui/Toast/Toast';
import QuickAction from '@/components/layout/QuickAction';
import styles from './layout.module.scss';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Next.js 15 with custom theme system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body>
        <Header />
        <Providers>
          <main className={styles.wrap}>{children}</main>
        </Providers>
        <QuickAction />

        <ToastContainer />
      </body>
    </html>
  );
}
