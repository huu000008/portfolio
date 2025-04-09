'use client';

import classNames from 'classnames';
import styles from './TransitionLink.module.scss';
import Link from 'next/link';

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export const TransitionLink = ({ href, children, className }: Props) => {
  return (
    <Link href={href} className={classNames(styles.wrap, className)}>
      {children}
    </Link>
  );
};
