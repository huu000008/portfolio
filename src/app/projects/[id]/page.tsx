import { getProjectByIdServer } from '@/lib/api/projects';
import { notFound } from 'next/navigation';
import { ProjectDetail } from '@/features/projects/components/ProjectDetail';
import { ProjectHeader } from '@/features/projects/components/ProjectHeader';

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * 프로젝트 상세 페이지 (서버 컴포넌트)
 * 서버에서 직접 데이터를 가져와 렌더링
 */
export default async function DetailPage({ params }: DetailPageProps) {
  // Ensure params is properly awaited before destructuring
  const { id } = await params;
  const project = await getProjectByIdServer(id); // 서버에서 직접 데이터 가져오기

  if (!project) return notFound();

  return (
    <>
      <ProjectHeader id={id} />
      <ProjectDetail project={project} />
    </>
  );
}
