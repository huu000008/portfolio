import { ProjectDetail } from '@/features/projects/components/ProjectDetail';
import { ProjectHeader } from '@/features/projects/components/ProjectHeader';
import { fetchProjectByIdAction } from '@/app/actions/projectActions';
import { notFound } from 'next/navigation';

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * 프로젝트 상세 페이지 (서버 컴포넌트)
 * 서버에서 직접 데이터를 가져와 렌더링
 * React 19 최적화 적용 및 에러 처리 개선
 */
export default async function DetailPage({ params }: DetailPageProps) {
  // ID 파라미터 가져오기 - Promise로 처리
  const { id } = await params;

  // console.log(`[DEBUG] 프로젝트 상세 페이지 로드 중: ID=${id}`);

  try {
    // 서버 액션을 통해 데이터 가져오기
    const project = await fetchProjectByIdAction(id);

    // 프로젝트 작성자 ID 추출
    const userId = project.user_id;

    return (
      <>
        <ProjectHeader id={id} userId={userId} />
        <ProjectDetail project={project} />
      </>
    );
  } catch (error) {
    console.error(`[ERROR] 프로젝트 상세 페이지 로드 실패:`, error);

    // 예외 발생 시 404 페이지로
    notFound();
  }
}
