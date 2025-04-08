import HomeContainer from '@/features/home/components/HomeContainer';
import { getProjectsServer } from '@/lib/api/projects';

export default async function Home() {
  const projects = await getProjectsServer();
  return <HomeContainer initialProjects={projects} />;
}
