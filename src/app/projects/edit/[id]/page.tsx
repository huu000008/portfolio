import { ProjectForm } from '@/features/projects/components/ProjectForm';
import { ProjectHeader } from '@/features/projects/components/ProjectHeader';
import { fetchProjectByIdAction } from '@/app/actions/projectActions';
import { requireAuth } from '@/app/actions/authActions';
import { isUser } from '@/utils/isUser';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { checkAdminStatus } from '@/lib/authUtils'; // 유틸리티 함수 임포트

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: '프로젝트 수정 | 포트폴리오',
  description: '프로젝트 정보를 수정합니다.',
};

export default async function EditPage({ params }: EditPageProps) {
  // 인증된 사용자만 접근 가능
  const user = await requireAuth();

  if (!isUser(user)) {
    // 인증 실패 시 로그인 페이지로 리다이렉트
    redirect('/login');
  }

  const { id } = await params;

  // 프로젝트 정보 가져오기
  const project = await fetchProjectByIdAction(id);

  // 현재 사용자가 관리자인지 확인 (유틸리티 함수 사용)
  const userIsAdmin = checkAdminStatus(user);

  // 현재 사용자가 작성자이거나 관리자인지 확인
  if (user.id !== project.user_id && !userIsAdmin) {
    console.log(
      `[AUTH ERROR] 접근 권한 없음: 사용자 ${user.id}가 프로젝트 ${id}의 작성자(${project.user_id})가 아니며 관리자도 아님`,
    );
    // 작성자도 아니고 관리자도 아니면 프로젝트 목록 페이지로 리다이렉트
    redirect('/projects');
  }

  // 관리자 모드로 접근한 경우 로그 기록
  if (userIsAdmin && user.id !== project.user_id) {
    // console.log(
    //   `[ADMIN ACCESS] 관리자 ${user.email}가 프로젝트 ${id} (작성자: ${project.user_id}) 수정 페이지에 접근`,
    // );
  }

  // project_period를 { from, to } 형태로 변환
  function parsePeriod(raw?: string) {
    if (!raw || typeof raw !== 'string' || !raw.includes('~')) {
      const today = new Date();
      return { from: today, to: today };
    }
    const [fromStr, toStr] = raw.split('~').map(s => s.trim());
    const from = new Date(fromStr);
    const to = new Date(toStr);
    const today = new Date();
    return {
      from: isNaN(from.getTime()) ? today : from,
      to: isNaN(to.getTime()) ? today : to,
    };
  }

  const formattedProject = {
    id: project.id,
    title: project.title,
    description: project.description,
    projectPeriod: parsePeriod(project.project_period),
    team: project.team,
    roles: project.roles,
    techStack: Array.isArray(project.tech_stack) ? project.tech_stack : [],
    contributions: project.contributions,
    achievements: project.achievements,
    retrospective: project.retrospective,
    thumbnailUrl: project.thumbnail_url ?? undefined,
  };

  return (
    <>
      <ProjectHeader id={id} userId={project.user_id} />
      <ProjectForm defaultValues={formattedProject} isEditMode />
    </>
  );
}
