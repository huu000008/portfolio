'use client';

import { useProjectStore } from '@/stores/projectStore';
import React from 'react';
import styles from './RecentProjects.module.scss';
import { TransitionLink } from '@/components/TransitionLink';

interface RecentProjectsProps {
  className?: string;
}

export default function RecentProjects({ className }: RecentProjectsProps) {
  const { projects, isLoading, fetchProjects } = useProjectStore();

  React.useEffect(() => {
    if (!projects && !isLoading) {
      fetchProjects();
    }
  }, [fetchProjects, projects, isLoading]);

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>New Project</div>
      <div className={styles.list}>
        {isLoading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          projects?.slice(0, 5).map((project, index) => (
            <TransitionLink
              href={`projects/${project.id}`}
              key={project.id}
              className={styles.item}
            >
              <div className={styles.title}>{project.title}</div>
              {index === 0 && <div className={styles.description}>{project.description}</div>}
            </TransitionLink>
          ))
        )}
      </div>
    </div>
  );
}
