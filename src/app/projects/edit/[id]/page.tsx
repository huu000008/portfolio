import { notFound } from 'next/navigation';
import { getProjectById } from '@/features/projects/api/getProjectById';
import { ProjectForm } from '@/features/projects/components/ProjectForm';

interface EditPageProps {
  params: { id: string };
}

export default async function EditPage({ params }: EditPageProps) {
  const project = await getProjectById(params.id);

  if (!project) return notFound();

  return <ProjectForm defaultValue={project} />;
}
