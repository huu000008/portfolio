'use client';

import { create } from 'zustand';
import { Project } from '@/types/project';
import { getProjects } from '@/features/projects/api/getProjects';
import { deleteProject } from '@/features/projects/api/deleteProject';

interface ProjectStore {
  projects: Project[] | null;
  isLoading: boolean;
  fetchProjects: () => Promise<void>;
  setProjects: (data: Project[]) => void;
  clearProjects: () => void;
  deleteProjectById: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: null,
  isLoading: false,

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const data = await getProjects();
      set({ projects: data });
    } catch (error) {
      console.error('프로젝트 목록 로딩 실패:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setProjects: data => set({ projects: data }),

  clearProjects: () => set({ projects: null }),

  deleteProjectById: async id => {
    set({ isLoading: true });
    try {
      await deleteProject(id);
      const updated = get().projects?.filter(project => project.id !== id) || [];
      set({ projects: updated });
    } catch (error) {
      console.error('프로젝트 삭제 실패:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
