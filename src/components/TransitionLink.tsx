'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};
