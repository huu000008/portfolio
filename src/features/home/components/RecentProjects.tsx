'use client';

import React, { useMemo, memo } from 'react';
import styles from './RecentProjects.module.scss';
import { TransitionLink } from '@/components/ui/TransitionLink/TransitionLink';
import { Project } from '@/types/project';
import { getPeriodEnd, formatRelativeTimeOrInProgress } from '@/utils/date';
import { InViewMotion } from '@/components/ui/InViewMotion';

// 방향 타입 정의
type Direction = 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top';

interface RecentProjectsProps {
  className?: string;
  projects: Project[] | null;
  isLoading: boolean;
  delayIncrement?: number;
}

// 방향 배열 정의 - 컴포넌트 외부로 이동하여 리렌더링 시 재생성 방지
const ANIMATION_DIRECTIONS: Direction[] = [
  'top-to-bottom',
  'left-to-right',
  'right-to-left',
  'bottom-to-top',
  'bottom-to-top',
];

// 각 프로젝트 아이템을 별도의 메모이제이션된 컴포넌트로 분리
const ProjectItem = memo(
  ({
    project,
    index,
    itemDirection,
    itemDelay,
  }: {
    project: Project;
    index: number;
    itemDirection: Direction;
    itemDelay: number;
  }) => {
    const endDate = getPeriodEnd(project.project_period);
    const periodRelative = formatRelativeTimeOrInProgress(endDate);

    return (
      <InViewMotion
        className={styles.item}
        key={project.id}
        delay={itemDelay}
        direction={itemDirection}
      >
        <TransitionLink href={`projects/${project.id}`}>
          <div className={styles.title}>{project.title}</div>
          {index === 0 && <div className={styles.description}>{project.description}</div>}
          <div className={styles.period}>{periodRelative}</div>
        </TransitionLink>
      </InViewMotion>
    );
  },
);

ProjectItem.displayName = 'ProjectItem';

function RecentProjects({ projects, delayIncrement = 0.3 }: RecentProjectsProps) {
  // 프로젝트 목록 메모이제이션
  const projectItems = useMemo(() => {
    if (!projects?.length) return null;

    // 최대 5개 항목만 표시
    return projects.slice(0, 5).map((project, index) => {
      // 해당 인덱스의 방향 가져오기
      const itemDirection = ANIMATION_DIRECTIONS[index];

      // 딜레이 계산: 첫 번째는 0, 나머지는 지수함수적으로 증가
      const itemDelay = index === 0 ? 0 : Math.pow(index, 1.5) * delayIncrement;

      return (
        <ProjectItem
          key={project.id}
          project={project}
          index={index}
          itemDirection={itemDirection}
          itemDelay={itemDelay}
        />
      );
    });
  }, [projects, delayIncrement]);

  // 목록이 비어있으면 별도 처리
  if (!projects?.length) {
    return (
      <div className={styles.wrap}>
        <InViewMotion className={styles.title}>Recent Projects</InViewMotion>
        <div className={styles.list}>
          <div className={styles.empty}>프로젝트가 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <InViewMotion className={styles.title}>Recent Projects</InViewMotion>
      <div className={styles.list}>{projectItems}</div>
    </div>
  );
}

export default memo(RecentProjects);
