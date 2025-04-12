'use client';

import { InViewMotion } from '../ui/InViewMotion';
import { TransitionLink } from '../ui/TransitionLink/TransitionLink';
import styles from './Header.module.scss';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoText, setLogoText] = useState('JUST DO');

  // 스크롤 이벤트 감지 및 로고 텍스트 변경
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // 100px 이상 스크롤했을 때 로고 텍스트 변경
      if (scrollPosition > 100 && !isScrolled) {
        setIsScrolled(true);
        setLogoText('JD');
      } else if (scrollPosition <= 100 && isScrolled) {
        setIsScrolled(false);
        setLogoText('JUST DO');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  return (
    <header className={`${styles.wrap} ${isScrolled ? styles.scrolled : ''}`}>
      <InViewMotion direction={'left-to-right'}>
        <TransitionLink href="/">
          <h1 className={styles.logo}>
            <span className={isScrolled ? styles.shrinked : styles.expanded}>{logoText}</span>
          </h1>
        </TransitionLink>
      </InViewMotion>
      {/* <div>
        {!isLoading && (
          <>
            {user ? (
              <Button onClick={signOut}>로그아웃</Button>
            ) : (
              <AuthModal trigger={<Button>로그인</Button>} initialMode="login" />
            )}
          </>
        )}
      </div> */}
    </header>
  );
}
