'use client';

import { Project } from '@/types/project';
import { ProjectItem } from './ProjectItem';
import styles from './ProjectList.module.scss';
import { cn } from '@/lib/utils';

interface Props {
  projects: Project[];
  variant?: 'grid' | 'list';
  emptyMessage?: string;
}

/**
 * 프로젝트 목록을 그리드 또는 리스트 형태로 표시하는 컴포넌트
 * @param projects - 표시할 프로젝트 배열
 * @param variant - 표시 형태 (grid 또는 list)
 * @param emptyMessage - 프로젝트가 없을 때 표시할 메시지
 */
export const ProjectList = ({
  projects,
  variant = 'list',
  emptyMessage = '프로젝트가 없습니다.',
}: Props) => {
  if (!projects.length) {
    return (
      <div className={styles.empty} role="status">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn(styles.wrap, styles[variant])}>
      {projects.map(project => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </div>
  );
};
