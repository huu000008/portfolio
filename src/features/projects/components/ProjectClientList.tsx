'use client';

import { useProjects } from '@/hooks/useProjects';
import { Project } from '@/types/project';
import { ProjectList } from './ProjectList';

interface ProjectClientListProps {
  initialProjects: Project[];
}

/**
 * 프로젝트 목록을 클라이언트에서 관리하는 컴포넌트
 * 서버에서 받은 초기 데이터를 사용하고, 필요시 React Query로 업데이트
 */
export function ProjectClientList({ initialProjects }: ProjectClientListProps) {
  // React Query를 사용하여 프로젝트 데이터 관리
  // initialData로 서버에서 받은 데이터를 사용하여 초기 로딩 상태 방지
  const { data: projects, isLoading, isError } = useProjects();

  // 에러 처리
  if (isError) {
    return <div>프로젝트 목록을 불러오는 중 오류가 발생했습니다.</div>;
  }

  // 로딩 상태일 때는 초기 데이터 사용
  const projectsToShow = isLoading ? initialProjects : projects || initialProjects;

  return <ProjectList projects={projectsToShow} />;
}
