import { getProjects } from '@/features/projects/api/getProjects';
import { ProjectHeader } from '@/features/projects/components/ProjectHeader';
import { ProjectList } from '@/features/projects/components/ProjectList';
import { Project } from '@/types/project';

const ProjectsPage = async () => {
  const projects: Project[] = await getProjects();
  return (
    <>
      <ProjectHeader />
      <ProjectList projects={projects} />
    </>
  );
};

export default ProjectsPage;
