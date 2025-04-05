'use client';

import styles from './Header.module.scss';
import { TransitionLink } from '../TransitionLink';
import { ThemeToggle } from '../ThemeToggle';

export const Header = () => {
  return (
    <header className={styles.wrap}>
      <h1>JOHYUKRAE</h1>
      <div className={styles.menu}>
        <TransitionLink href="/">Home</TransitionLink>
        <TransitionLink href="/about">About</TransitionLink>
        <TransitionLink href="/projects">Projects</TransitionLink>
      </div>
      <ThemeToggle />
    </header>
  );
};
