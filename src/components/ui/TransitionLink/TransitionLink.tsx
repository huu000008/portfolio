'use client';

import { cn } from '@/lib/utils';
import styles from './TransitionLink.module.scss';
import Link from 'next/link';

type Props = {
  href: string;
  children: React.ReactNode;
  isButton?: boolean;
  className?: string;
};

export const TransitionLink = ({ href, children, isButton, className }: Props) => {
  return (
    <Link href={href} className={cn(styles.wrap, className, isButton && styles.button)}>
      {children}
    </Link>
  );
};
