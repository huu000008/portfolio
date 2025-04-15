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
    let animationId: number | null = null;

    if (isMainPage) {
      setScrolled(false);
      setLogoText('JUST DO');

      // setTimeout 대신 requestAnimationFrame 사용
      const startTime = performance.now();
      const animate = (currentTime: number) => {
        if (currentTime - startTime >= 2000) {
          setScrolled(true);
          setLogoText('JD');
          return;
        }
        animationId = requestAnimationFrame(animate);
      };

      animationId = requestAnimationFrame(animate);
    } else {
      setScrolled(true);
      setLogoText('JD');
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
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
