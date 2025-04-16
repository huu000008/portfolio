'use client';

import { TransitionLink } from '../ui/TransitionLink/TransitionLink';
import styles from './Header.module.scss';
import { useEffect, useMemo, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { InViewMotion } from '../ui/InViewMotion';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [logoText, setLogoText] = useState('JUST DO');

  const animatedOnce = useRef(false); // 최초 1회만 애니메이션

  useEffect(() => {
    let timeoutId: number | null = null;

    if (pathname === '/' && !animatedOnce.current) {
      animatedOnce.current = true;
      setScrolled(false);
      setLogoText('JUST DO');

      timeoutId = window.setTimeout(() => {
        setScrolled(true);
        setLogoText('JD');
      }, 2000);
    } else {
      setScrolled(true);
      setLogoText('JD');
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 최초 마운트에만 실행

  const headerClass = useMemo(
    () => `${styles.wrap} ${scrolled ? styles.scrolled : ''}`,
    [scrolled],
  );

  const logoClass = useMemo(() => (scrolled ? styles.shrinked : styles.expanded), [scrolled]);

  return (
    <>
      <header className={headerClass}>
        <InViewMotion direction="left-to-right">
          <TransitionLink href="/" aria-label="홈페이지로 이동">
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
    initial: { opacity: 0, transform: 'translateY(10px)' },
    animate: {
      opacity: 1,
      transform: 'translateY(0px)',
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      transform: 'translateY(-10px)',
      transition: { duration: 0.15 },
    },
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
