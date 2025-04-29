'use client';

import { Project } from '@/types/project';
import { ProjectItem } from './ProjectItem';
import { ProjectHeader } from './ProjectHeader';

interface Props {
  projects: Project[];
  emptyMessage?: string;
}

/**
 * 프로젝트 목록을 그리드 또는 리스트 형태로 표시하는 컴포넌트
 * @param projects - 표시할 프로젝트 배열
 * @param emptyMessage - 프로젝트가 없을 때 표시할 메시지
 */
export const ProjectList = ({ projects, emptyMessage = '프로젝트가 없습니다.' }: Props) => {
  if (!projects.length) {
    return (
      <div className="text-center text-muted-foreground py-8" role="status">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full">
      <ProjectHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20 max-w-[120rem] w-full mx-auto p-20 md:p-8">
        {projects.map(project => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};
