import { ProjectHeader } from '@/features/projects/components/ProjectHeader';
import { ProjectList } from '@/features/projects/components/ProjectList';
import { fetchProjectsAction } from '@/app/actions/projectActions';

/**
 * 프로젝트 목록 페이지 (서버 컴포넌트)
 * 서버에서 직접 데이터를 가져와 렌더링
 */
export default async function ProjectsPage() {
  // 서버 액션을 통해 프로젝트 데이터 가져오기
  const projects = await fetchProjectsAction();

  return (
    <>
      <ProjectHeader />
      <ProjectList projects={projects} />
    </>
  );
}
