'use client';

import { useAuth } from '@/contexts/AuthContext';
import { TransitionLink } from '../ui/TransitionLink/TransitionLink';
import AuthModal from '../auth/AuthModal';
import styles from './Header.module.scss';
import Button from '../ui/Button/Button';

export default function Header() {
  const { user, signOut, isLoading } = useAuth();

  return (
    <header className={styles.wrap}>
      <TransitionLink href="/">
        <h1>JOHYUKRAE</h1>
      </TransitionLink>
      <div>
        {!isLoading && (
          <>
            {user ? (
              <Button onClick={signOut}>로그아웃</Button>
            ) : (
              <AuthModal trigger={<Button>로그인</Button>} initialMode="login" />
            )}
          </>
        )}
      </div>
    </header>
  );
}
