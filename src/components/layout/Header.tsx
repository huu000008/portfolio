'use client';

import { TransitionLink } from '../ui/TransitionLink/TransitionLink';
import styles from './Header.module.scss';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { InViewMotion } from '../ui/InViewMotion';
import { motion } from 'framer-motion';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [logoText, setLogoText] = useState('JUST DO');
  const pathname = usePathname();
  const isMainPage = useMemo(() => pathname === '/', [pathname]);
  const prevScrollY = useRef(0);
  const ticking = useRef(false);

  // 스크롤 핸들러 - 디바운싱 적용
  const handleScroll = useCallback(() => {
    if (!isMainPage) return;

    const scrollPosition = window.scrollY;

    // 이전 스크롤 위치와 크게 다를 때만 처리 (최적화)
    if (Math.abs(scrollPosition - prevScrollY.current) < 10) return;

    prevScrollY.current = scrollPosition;

    // requestAnimationFrame을 사용하여 디바운싱 적용
    if (!ticking.current) {
      requestAnimationFrame(() => {
        if (scrollPosition > 100 && !scrolled) {
          setScrolled(true);
          setLogoText('JD');
        } else if (scrollPosition <= 100 && scrolled) {
          setScrolled(false);
          setLogoText('JUST DO');
        }
        ticking.current = false;
      });

      ticking.current = true;
    }
  }, [isMainPage, scrolled]);

  // 경로 변경 시 처리
  useEffect(() => {
    // 현재 페이지가 메인 페이지가 아닌 경우 항상 scrolled 상태 적용
    if (!isMainPage) {
      setScrolled(true);
      setLogoText('JD');
    } else {
      // 메인 페이지로 돌아온 경우 현재 스크롤 위치에 따라 상태 결정
      const scrollPosition = window.scrollY;
      if (scrollPosition <= 100) {
        setScrolled(false);
        setLogoText('JUST DO');
      } else {
        setScrolled(true);
        setLogoText('JD');
      }
    }
  }, [isMainPage]);

  // 스크롤 이벤트 리스너 등록 (메인 페이지에서만)
  useEffect(() => {
    if (isMainPage) {
      // Passive 옵션으로 성능 향상
      window.addEventListener('scroll', handleScroll, { passive: true });

      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isMainPage, handleScroll]);

  // 메모이제이션된 클래스 계산
  const headerClass = useMemo(
    () => `${styles.wrap} ${scrolled ? styles.scrolled : ''}`,
    [scrolled],
  );

  const logoClass = useMemo(() => (scrolled ? styles.shrinked : styles.expanded), [scrolled]);

  return (
    <header className={headerClass}>
      <InViewMotion direction="left-to-right">
        <TransitionLink href="/">
          <h1 className={styles.logo}>
            <span className={logoClass}>
              <TextMorph text={logoText} />
            </span>
          </h1>
        </TransitionLink>
      </InViewMotion>
    </header>
  );
}

// 글자 하나씩 모핑하는 애니메이션
const TextMorph = ({ text }: { text: string }) => {
  const characters = text.split('');

  return (
    <>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
          }}
          className={styles.character}
        >
          {char}
        </motion.span>
      ))}
    </>
  );
};
