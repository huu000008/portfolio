import HomeContainer from '@/features/home/components/HomeContainer';
import { fetchProjectsAction } from '@/app/actions/projectActions';

export default async function Home() {
  const projects = await fetchProjectsAction();
  return <HomeContainer initialProjects={projects} />;
}
