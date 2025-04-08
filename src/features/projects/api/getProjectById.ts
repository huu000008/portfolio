import { Project } from '@/types/project';

/**
 * 특정 ID의 프로젝트를 가져오는 함수 (클라이언트 컴포넌트용)
 */
export async function getProjectById(id: string): Promise<Project | null> {
  try {
    // 절대 URL 사용으로 변경
    // window.location.origin이 브라우저 환경에서만 사용 가능하므로 조건부 처리
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const apiPath = `${baseUrl}/api/projects/${id}`;

    const response = await fetch(apiPath, {
      // 캐시 방지 옵션 추가
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`프로젝트 조회 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('프로젝트 조회 중 오류 발생:', error);
    return null;
  }
}
