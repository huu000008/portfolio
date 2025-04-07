import React from 'react';
import { ThemeToggle } from '../ThemeToggle';
import styles from './QuickAction.module.scss';

const QuickAction = () => {
  return (
    <div className={styles.wrap}>
      <ThemeToggle />
    </div>
  );
};

export default QuickAction;
