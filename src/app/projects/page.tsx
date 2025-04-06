import { ProjectHeader } from '@/features/projects/components/ProjectHeader';
import { ProjectListLoader } from '@/features/projects/components/ProjectListLoader';

export default function ProjectsPage() {
  return (
    <>
      <ProjectHeader />
      <ProjectListLoader />
    </>
  );
}
