'use client';

import React from 'react';
import { ThemeToggle } from '../ThemeToggle';
import styles from './QuickAction.module.scss';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ExitIcon, EnterIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

const QuickAction = () => {
  const { user, signOut } = useAuth();

  return (
    <div className={styles.wrap}>
      {user ? (
        <Button onClick={signOut} aria-label="로그아웃">
          <ExitIcon />
        </Button>
      ) : (
        <Button asChild>
          <Link href={{ pathname: '/login' }} aria-label="로그인">
            <EnterIcon />
          </Link>
        </Button>
      )}
      <ThemeToggle />
    </div>
  );
};

export default QuickAction;
