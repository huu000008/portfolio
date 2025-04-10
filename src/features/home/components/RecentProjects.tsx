'use client';

import React from 'react';
import styles from './RecentProjects.module.scss';
import { TransitionLink } from '@/components/ui/TransitionLink/TransitionLink';
import { Project } from '@/types/project';
import { getPeriodEnd, formatRelativeTimeOrInProgress } from '@/utils/date';
import { InViewMotion } from '@/components/ui/InViewMotion';

interface RecentProjectsProps {
  className?: string;
  projects: Project[] | null;
  isLoading: boolean;
}

export default function RecentProjects({ projects, isLoading }: RecentProjectsProps) {
  return (
    <div className={styles.wrap}>
      <InViewMotion className={styles.title}>Recent Projects</InViewMotion>
      <div className={styles.list}>
        {isLoading && projects === null ? (
          <div className={styles.loading}>Loading...</div>
        ) : projects?.length === 0 ? (
          <div className={styles.empty}>프로젝트가 없습니다.</div>
        ) : (
          projects?.slice(0, 5).map((project, index) => {
            const endDate = getPeriodEnd(project.project_period);
            const periodRelative = formatRelativeTimeOrInProgress(endDate);

            return (
              <InViewMotion className={styles.item} key={project.id}>
                <TransitionLink href={`projects/${project.id}`}>
                  <div className={styles.title}>{project.title}</div>
                  {index === 0 && <div className={styles.description}>{project.description}</div>}

                  <div className={styles.period}>{periodRelative}</div>
                </TransitionLink>
              </InViewMotion>
            );
          })
        )}
      </div>
    </div>
  );
}
