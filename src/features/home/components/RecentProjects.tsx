'use client';

import React from 'react';
import styles from './RecentProjects.module.scss';
import { TransitionLink } from '@/components/TransitionLink';
import { Project } from '@/types/project';
import { getPeriodEnd, formatRelativeTimeOrInProgress } from '@/utils/date';

interface RecentProjectsProps {
  className?: string;
  projects: Project[] | null;
  isLoading: boolean;
}

export default function RecentProjects({ projects, isLoading }: RecentProjectsProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.title}>Recent Projects</div>
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
              <TransitionLink
                href={`projects/${project.id}`}
                key={project.id}
                className={styles.item}
              >
                <div className={styles.title}>{project.title}</div>
                {index === 0 && <div className={styles.description}>{project.description}</div>}

                <div className={styles.period}>{periodRelative}</div>
              </TransitionLink>
            );
          })
        )}
      </div>
    </div>
  );
}
