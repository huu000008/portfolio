// src/stores/projectStore.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project } from '@/types/project';
import { getProjects } from '@/features/projects/api/getProjects';

interface ProjectStore {
  projects: Project[] | null;
  hasFetchedOnce: boolean;
  isLoading: boolean;
  fetchProjects: () => Promise<void>;
  setProjects: (data: Project[]) => void;
  clearProjects: () => void;
  deleteProjectById: (id: string) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: null,
      hasFetchedOnce: false,
      isLoading: false,

      fetchProjects: async () => {
        set({ isLoading: true });
        try {
          const data = await getProjects();
          set({ projects: data, hasFetchedOnce: true });
        } catch (error) {
          console.error('프로젝트 목록 로딩 실패:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      setProjects: data => set({ projects: data, hasFetchedOnce: true }),

      clearProjects: () => set({ projects: null, hasFetchedOnce: false }),

      deleteProjectById: async id => {
        set({ isLoading: true });
        try {
          const updated = get().projects?.filter(project => project.id !== id) || [];
          set({ projects: updated });
        } catch (error) {
          console.error('프로젝트 삭제 실패:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateProject: async (id, data) => {
        set({ isLoading: true });
        try {
          const projects = get().projects || [];
          const updatedProjects = projects.map(project =>
            project.id === id ? { ...project, ...data } : project,
          );
          set({ projects: updatedProjects });
        } catch (error) {
          console.error('프로젝트 업데이트 실패:', error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'project-storage',
      onRehydrateStorage: () => state => {
        state?.setProjects([]);
      },
    },
  ),
);
