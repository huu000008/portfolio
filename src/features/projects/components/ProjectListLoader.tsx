'use client';

import { useEffect } from 'react';
import { useProjectStore } from '@/stores/projectStore';
import { ProjectList } from './ProjectList';

export const ProjectListLoader = () => {
  const { projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    if (!projects) {
      fetchProjects();
    }
  }, [projects, fetchProjects]);

  return <ProjectList projects={projects || []} />;
};
