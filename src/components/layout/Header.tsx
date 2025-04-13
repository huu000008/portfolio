'use client';

import { TransitionLink } from '../ui/TransitionLink/TransitionLink';
import styles from './Header.module.scss';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { InViewMotion } from '../ui/InViewMotion';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [logoText, setLogoText] = useState('JUST DO');
  const pathname = usePathname();
  const isMainPage = useMemo(() => pathname === '/', [pathname]);

  // IntersectionObserver를 활용한 헤더 동작 제어
  const [headerSentinelRef, headerSentinelInView] = useInView({
    /* 화면 상단으로부터의 offset을 100px로 설정 */
    rootMargin: '-100px 0px 0px 0px',
    threshold: 0,
    initialInView: true,
  });

  // 뷰포트가 변경될 때마다 스크롤 상태 업데이트
  useEffect(() => {
    if (!isMainPage) {
      // 메인 페이지가 아닌 경우 항상 축소된 상태
      setScrolled(true);
      setLogoText('JD');
      return;
    }

    // 메인 페이지에서는 InView 상태에 따라 설정
    if (headerSentinelInView) {
      setScrolled(false);
      setLogoText('JUST DO');
    } else {
      setScrolled(true);
      setLogoText('JD');
    }
  }, [headerSentinelInView, isMainPage]);

  // 메모이제이션된 클래스 계산
  const headerClass = useMemo(
    () => `${styles.wrap} ${scrolled ? styles.scrolled : ''}`,
    [scrolled],
  );

  const logoClass = useMemo(() => (scrolled ? styles.shrinked : styles.expanded), [scrolled]);

  return (
    <>
      {/* 메인 페이지일 때만 감시 요소 사용 */}
      {isMainPage && <div ref={headerSentinelRef} className={styles.headerSentinel} />}

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
    </>
  );
}

// 글자 하나씩 모핑하는 애니메이션
const TextMorph = ({ text }: { text: string }) => {
  const characters = text.split('');

  return (
    <>
      {characters.map((char, index) => (
        <motion.span
          key={`${char}-${index}-${text.length}`} // 더 안정적인 키 값
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
