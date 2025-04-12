'use client';

import React from 'react';
import { ThemeToggle } from '../ThemeToggle';
import styles from './QuickAction.module.scss';
import Button from '@/components/ui/Button/Button';
import AuthModal from '@/components/auth/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { ExitIcon, EnterIcon } from '@radix-ui/react-icons';

const QuickAction = () => {
  const { user, signOut } = useAuth();

  return (
    <div className={styles.wrap}>
      {user ? (
        <Button onClick={signOut} aria-label="로그아웃">
          <ExitIcon />
        </Button>
      ) : (
        <AuthModal
          trigger={
            <Button aria-label="로그인">
              <EnterIcon />
            </Button>
          }
          initialMode="login"
        />
      )}
      <ThemeToggle />
    </div>
  );
};

export default QuickAction;
