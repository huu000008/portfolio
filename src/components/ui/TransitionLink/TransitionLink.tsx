'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import classNames from 'classnames'; 
import styles from './TransitionLink.module.scss';

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export const TransitionLink = ({ href, children, className }: Props) => {
  const router = useRouter();

  useEffect(() => {
    router.prefetch(href);
  }, [href, router]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!document.startViewTransition) {
      router.push(href);
      return;
    }
    document.startViewTransition(() => router.push(href));
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={classNames(styles.wrap, className)}
    >
      {children}
    </a>
  );
};
