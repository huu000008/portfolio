'use client';

import { useEffect } from 'react';
import { useProjectStore } from '@/stores/projectStore';
import ProjectListServer from './ProjectListServer';

export const ProjectListLoader = () => {
  const { projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    if (!projects) {
      fetchProjects();
    }
  }, [projects, fetchProjects]);

  return <ProjectListServer projects={projects || []} />;
};
