import { TransitionLink } from '@/components/TransitionLink';
import React from 'react';
import styles from './ProjectHeader.module.scss';

export const ProjectHeader = () => {
  return (
    <div className={styles.wrap}>
      <h2>Projects</h2>
      <TransitionLink href="/projects/write">글작성</TransitionLink>
    </div>
  );
};
