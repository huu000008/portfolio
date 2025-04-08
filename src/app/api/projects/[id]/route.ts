import { NextResponse } from 'next/server';
import { getProjectByIdServer } from '@/lib/api/projects';

/**
 * 특정 ID의 프로젝트를 조회하는 API 엔드포인트
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const project = await getProjectByIdServer(id);

    if (!project) {
      return NextResponse.json({ error: '프로젝트를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('프로젝트 조회 중 오류 발생:', error);
    return NextResponse.json({ error: '프로젝트 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
