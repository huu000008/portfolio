'use client';

import React, { useMemo, memo, useCallback } from 'react';
import Link from 'next/link';
import { Project } from '@/types/project';
import { getPeriodEnd, formatRelativeTimeOrInProgress } from '@/utils/date';
import { InViewMotion } from '@/components/ui/InViewMotion';
import styles from './RecentProjects.module.scss';

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

// 지연 시간 계산 함수 - 컴포넌트 외부로 이동하여 리렌더링 시 재계산 방지
const calculateDelay = (index: number, increment: number): number => {
  return index === 0 ? 0 : Math.pow(index, 1) * increment;
};

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
    // 날짜 계산 메모이제이션
    const periodRelative = useMemo(() => {
      const endDate = getPeriodEnd(project.project_period);
      return formatRelativeTimeOrInProgress(endDate);
    }, [project.project_period]);

    return (
      <InViewMotion
        className={styles.item}
        key={project.id}
        delay={itemDelay}
        direction={itemDirection}
      >
        <Link
          href={{ pathname: `/projects/${project.id}` }}
          aria-label={`${project.title} 프로젝트 상세 정보 보기`}
        >
          <div className={styles.title}>{project.title}</div>
          {index === 0 && <div className={styles.description}>{project.description}</div>}
          <div className={styles.period}>{periodRelative}</div>
        </Link>
      </InViewMotion>
    );
  },
);

ProjectItem.displayName = 'ProjectItem';

function RecentProjects({ projects, delayIncrement = 0.3 }: RecentProjectsProps) {
  // 프로젝트 슬라이싱 메모이제이션 - 최대 5개 항목만 표시
  const slicedProjects = useMemo(() => {
    return projects?.length ? projects.slice(0, 5) : [];
  }, [projects]);

  // 방향 가져오기 함수 메모이제이션
  const getDirection = useCallback((index: number): Direction => {
    return ANIMATION_DIRECTIONS[index % ANIMATION_DIRECTIONS.length];
  }, []);

  // 프로젝트 목록 메모이제이션
  const projectItems = useMemo(() => {
    if (!slicedProjects.length) return null;

    return slicedProjects.map((project, index) => {
      // 해당 인덱스의 방향 가져오기
      const itemDirection = getDirection(index);

      // 딜레이 계산: 미리 정의된 함수 사용
      const itemDelay = calculateDelay(index, delayIncrement);

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
  }, [slicedProjects, delayIncrement, getDirection]);

  // 목록이 비어있으면 별도 처리
  if (!projects?.length) {
    return (
      <div className={styles.wrap}>
        <InViewMotion className={styles.sectionTitle}>Recent Projects</InViewMotion>
        <div className={styles.empty}>프로젝트가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <InViewMotion className={styles.sectionTitle}>Recent Projects</InViewMotion>
      <div className={styles.list}>
        {projectItems}
        <InViewMotion
          className={styles.more}
          delay={calculateDelay(slicedProjects.length, delayIncrement)}
          direction={getDirection(slicedProjects.length)}
        >
          <Link href="/projects" aria-label="모든 프로젝트 목록 보기">
            More
            <span className="sr-only">View All Projects</span>
          </Link>
        </InViewMotion>
      </div>
    </div>
  );
}

export default memo(RecentProjects);
