'use client';

import { cn } from '@/lib/utils';
import styles from './TransitionLink.module.scss';
import Link from 'next/link';
import { useCallback } from 'react';
import { usePathname } from 'next/navigation';

type Props = {
  href: string;
  children: React.ReactNode;
  isButton?: boolean;
  className?: string;
  scrollToTop?: boolean;
  scrollOptions?: ScrollToOptions;
};

export const TransitionLink = ({
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
        window.scrollTo({
          top: 0,
          ...scrollOptions,
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
    >
      {children}
    </Link>
  );
};
