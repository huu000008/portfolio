'use client';

import styles from './Header.module.scss';
import { TransitionLink } from '../TransitionLink';

export const Header = () => {
  return (
    <header className={styles.wrap}>
      <TransitionLink href="/">
        <h1>JOHYUKRAE</h1>
      </TransitionLink>
    </header>
  );
};
