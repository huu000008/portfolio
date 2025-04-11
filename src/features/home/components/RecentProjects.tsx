'use client';

import React, { useMemo } from 'react';
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

/**
 * 최근 프로젝트 목록 컴포넌트
 * React 19 최적화가 적용된 컴포넌트
 */
export default function RecentProjects({ projects, isLoading }: RecentProjectsProps) {
  // 프로젝트 목록 메모이제이션 - 불필요한 리렌더링 방지
  const projectItems = useMemo(() => {
    if (!projects?.length) return null;

    // 최대 5개 항목만 표시
    return projects.slice(0, 5).map((project, index) => {
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
    });
  }, [projects]);

  // 로딩 상태 UI - 간결한 로딩 표시
  const loadingState = (
    <div className={styles.loading}>
      <div className={styles.loadingBar}></div>
    </div>
  );

  // 빈 상태 UI
  const emptyState = <div className={styles.empty}>프로젝트가 없습니다.</div>;

  return (
    <div className={styles.wrap}>
      <InViewMotion className={styles.title}>Recent Projects</InViewMotion>
      <div className={styles.list}>
        {isLoading && !projectItems ? loadingState : !projectItems ? emptyState : projectItems}
      </div>
    </div>
  );
}
