'use client';

import { cn } from '@/lib/utils';
import styles from './TransitionLink.module.scss';
import Link from 'next/link';
import { useCallback, memo } from 'react';
import { usePathname } from 'next/navigation';

type Props = {
  href: string;
  children: React.ReactNode;
  isButton?: boolean;
  className?: string;
  scrollToTop?: boolean;
  scrollOptions?: ScrollToOptions;
};

const TransitionLinkBase = ({
  href,
  children,
  isButton,
  className,
  scrollToTop = false,
  scrollOptions = { behavior: 'smooth' },
}: Props) => {
  const pathname = usePathname();

  // 현재 경로가 홈('/')이고 대상 href도 '/'인 경우 최상단으로 스크롤
  const isHomeLink = href === '/' && pathname === '/';

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // 링크가 홈을 가리키거나 scrollToTop이 true인 경우
      if (isHomeLink || scrollToTop) {
        e.preventDefault();
        // 성능 최적화: requestAnimationFrame 사용
        requestAnimationFrame(() => {
          window.scrollTo({
            top: 0,
            ...scrollOptions,
          });
        });
      }
    },
    [isHomeLink, scrollToTop, scrollOptions],
  );

  return (
    <Link
      href={href}
      className={cn(styles.wrap, className, isButton && styles.button)}
      onClick={handleClick}
      prefetch={true} // 성능 최적화: 필요한 경우에만 prefetch 활성화
    >
      {children}
    </Link>
  );
};

// 메모이제이션으로 불필요한 리렌더링 방지
export const TransitionLink = memo(TransitionLinkBase);
