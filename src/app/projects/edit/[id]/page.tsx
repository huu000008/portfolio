import { ProjectForm } from '@/features/projects/components/ProjectForm';
import { ProjectHeader } from '@/features/projects/components/ProjectHeader';
import { fetchProjectByIdAction } from '@/app/actions/projectActions';
import { requireAuth } from '@/app/actions/authActions';
import { Metadata } from 'next';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: '프로젝트 수정 | 포트폴리오',
  description: '프로젝트 정보를 수정합니다.',
};

export default async function EditPage({ params }: EditPageProps) {
  // 인증된 사용자만 접근 가능
  await requireAuth();

  const { id } = await params;
  const project = await fetchProjectByIdAction(id);

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
      <ProjectHeader id={id} />
      <ProjectForm defaultValues={formattedProject} isEditMode />
    </>
  );
}
