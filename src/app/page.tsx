// src/app/page.tsx
import { getProjects } from '@/features/projects/api/getProjects';
import ProjectListServer from '@/features/projects/components/ProjectListServer';

export default async function Home() {
  const projects = await getProjects();

  return (
    <div>
      <main>
        <ProjectListServer projects={projects?.slice(0, 5) || []} />
      </main>
    </div>
  );
}
