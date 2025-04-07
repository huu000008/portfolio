import { notFound } from 'next/navigation';
import { getProjectById } from '@/features/projects/api/getProjectById';
import { ProjectForm } from '@/features/projects/components/ProjectForm';
import { ProjectHeader } from '@/features/projects/components/ProjectHeader';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPage({ params }: EditPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) return notFound();

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
