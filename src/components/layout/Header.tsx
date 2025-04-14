'use client';

import { TransitionLink } from '../ui/TransitionLink/TransitionLink';
import styles from './Header.module.scss';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { InViewMotion } from '../ui/InViewMotion';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const pathname = usePathname();
  const isMainPage = useMemo(() => pathname === '/', [pathname]);

  const [scrolled, setScrolled] = useState(false);
  const [logoText, setLogoText] = useState('JUST DO');

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isMainPage) {
      // 메인 페이지에서는 초기에 확장된 상태로 시작
      setScrolled(false);
      setLogoText('JUST DO');

      timer = setTimeout(() => {
        setScrolled(true);
        setLogoText('JD');
      }, 2000);
    } else {
      // 다른 페이지에서는 축소된 상태로 시작
      setScrolled(true);
      setLogoText('JD');
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isMainPage]);

  const headerClass = useMemo(
    () => `${styles.wrap} ${scrolled ? styles.scrolled : ''}`,
    [scrolled],
  );

  const logoClass = useMemo(() => (scrolled ? styles.shrinked : styles.expanded), [scrolled]);

  return (
    <>
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

const TextMorph = ({ text }: { text: string }) => {
  const characters = text.split('');

  const spanVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={text}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ staggerChildren: 0.05 }}
      >
        {characters.map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            variants={spanVariants}
            className={styles.character}
            style={{ display: 'inline-block' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
