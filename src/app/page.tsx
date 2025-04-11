import HomeContainer from '@/features/home/components/HomeContainer';
import { fetchProjectsAction } from '@/app/actions/projectActions';
import { Suspense } from 'react';
import { Project } from '@/types/project';

/**
 * 메인 페이지 서버 컴포넌트
 * React 19 최적화 적용:
 * - 서버 컴포넌트에서 데이터 미리 로드
 * - Suspense로 점진적 페이지 로딩
 * - 자동 Promise 처리
 */
export default async function Home() {
  // 서버에서 데이터 미리 로드 (Next.js 15 + React 19 패턴)
  // React 19에서는 자동으로 Promise를 처리합니다
  const projects: Project[] = await fetchProjectsAction();

  return (
    <Suspense fallback={<div className="loading">Loading homepage...</div>}>
      <HomeContainer initialProjects={projects} />
    </Suspense>
  );
}
