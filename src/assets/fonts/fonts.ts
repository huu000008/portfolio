import localFont from 'next/font/local';

/**
 * Pretendard 폰트 최적화 설정
 * - 서브셋 폰트 적용으로 초기 로딩 속도 개선
 * - 폰트 파일 사전 로드 및 최적화
 * - font-display: swap 적용으로 CLS 개선
 */
export const pretendard = localFont({
  src: [
    {
      path: './Pretendard-Regular.subset.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Pretendard-Medium.subset.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './Pretendard-SemiBold.subset.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './Pretendard-Bold.subset.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  variable: '--font-pretendard',
});
