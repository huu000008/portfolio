import HomeContainer from '@/features/home/components/HomeContainer';
import { getProjects } from '@/features/projects/api/getProjects';

export default async function Home() {
  const projects = await getProjects();
  return <HomeContainer initialProjects={projects} />;
}
