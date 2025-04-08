import { Project } from '@/types/project';
import { ProjectGrid } from '../../projects/components/ProjectGrid';

interface Props {
  projects: Project[];
}

/**
 * 서버 컴포넌트에서 사용하는 프로젝트 목록 컴포넌트
 * 내부적으로 ProjectGrid 컴포넌트를 사용하여 그리드 형태로 표시
 */
export default function ProjectListServer({ projects }: Props) {
  return (
    <ProjectGrid
      projects={projects || []}
      variant="grid"
      emptyMessage="등록된 프로젝트가 없습니다."
    />
  );
}
