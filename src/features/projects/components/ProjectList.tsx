import { Project } from '@/types/project';
import { ProjectGrid } from './ProjectGrid';

interface Props {
  projects: Project[];
}

/**
 * 프로젝트 목록을 표시하는 컴포넌트
 * 내부적으로 ProjectGrid 컴포넌트를 사용하여 리스트 형태로 표시
 */
export const ProjectList = ({ projects }: Props) => {
  return <ProjectGrid projects={projects} variant="list" />;
};
