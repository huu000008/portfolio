import type { Metadata } from 'next';
import '@/assets/styles/tailwind.css';
import '@/assets/styles/globals.scss';
import { ThemeScript } from '@/components/ThemeScript';
import Header from '@/components/layout/Header';
import Providers from './providers';
import { ToastContainer } from '@/components/ui/Toast/Toast';
import QuickAction from '@/components/layout/QuickAction';
import { pretendard } from '@/assets/fonts/fonts';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Next.js 15 with custom theme system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning className={pretendard.variable}>
      <head>
        <ThemeScript />
      </head>
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <QuickAction />
        </Providers>

        <ToastContainer />
      </body>
    </html>
  );
}
