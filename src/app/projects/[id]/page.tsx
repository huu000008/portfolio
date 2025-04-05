import { getProjectById } from '@/features/projects/api/getProjectById';
import { notFound } from 'next/navigation';
import { ProjectDetail } from '@/features/projects/components/ProjectDetail';

interface ViewPageProps {
  params: { id: string };
}

export default async function ViewPage({ params }: ViewPageProps) {
  const project = await getProjectById(params.id);
  if (!project) return notFound();

  return <ProjectDetail project={project} />;
}
