import { ProjectForm } from '@/features/projects/components/ProjectForm';
import { ProjectHeader } from '@/features/projects/components/ProjectHeader';
import { fetchProjectByIdAction } from '@/app/actions/projectActions';
import { requireAuth } from '@/app/actions/authActions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { User } from '@/types/user';

// 관리자 이메일 목록 (AuthContext와 동일하게 유지)
const ADMIN_EMAILS = ['sqwasd@naver.com']; // 실제 관리자 이메일로 변경 필요

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: '프로젝트 수정 | 포트폴리오',
  description: '프로젝트 정보를 수정합니다.',
};

/**
 * 현재 사용자가 관리자인지 확인하는 함수
 */
async function isAdmin(user: User | null) {
  if (!user || !user.email) return false;
  return ADMIN_EMAILS.includes(user.email);
}

export default async function EditPage({ params }: EditPageProps) {
  // 인증된 사용자만 접근 가능
  const user = await requireAuth();

  const { id } = await params;

  // 프로젝트 정보 가져오기
  const project = await fetchProjectByIdAction(id);

  // 현재 사용자가 관리자인지 확인
  const userIsAdmin = await isAdmin(user);

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

  const formattedProject = {
    id: project.id,
    title: project.title,
    description: project.description,
    projectPeriod: project.project_period,
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
