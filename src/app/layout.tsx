import type { Metadata } from 'next';
import '@/assets/styles/globals.css';
import Header from '@/components/layout/Header';
import Providers from './providers';

import QuickAction from '@/components/layout/QuickAction';
import { pretendard } from '@/assets/fonts/fonts';
import { Noto_Sans_KR } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-noto-sans-kr',
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | 조혁래 포트폴리오',
    default: '조혁래',
  },
  description: '프론트엔드 개발자 조혁래의 포트폴리오 사이트입니다.',
  keywords: ['프론트엔드', '웹개발', '코딩', 'React', 'Next.js', '블로그'],
  authors: [{ name: '조혁래', url: 'https://github.com/huu000008' }],
  creator: '조혁래',
  publisher: '조혁래',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  alternates: {
    canonical: '/',
  },
  other: {
    google: 'notranslate',
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="ko" className={pretendard.variable} suppressHydrationWarning>
      <body className={`${notoSansKr.variable} antialiased`}>
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
