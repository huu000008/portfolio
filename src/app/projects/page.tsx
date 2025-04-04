import { getProjects } from "@/features/projects/api/getProjects";
import { ProjectList } from "@/features/projects/components/ProjectList";

const ProjectsPage = async () => {
  const projects = await getProjects();

  return <ProjectList projects={projects} />;
};

export default ProjectsPage;
