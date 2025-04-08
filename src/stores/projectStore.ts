'use client';

import { create } from 'zustand';
import { Project } from '@/types/project';
import { supabaseClient } from '@/lib/supabase/client';

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: Error | null;
  fetchProjects: () => Promise<void>;
  setProjects: (projects: Project[]) => void;
}

/**
 * 프로젝트 상태를 관리하는 스토어
 * Zustand를 사용하여 전역 상태로 프로젝트 목록을 관리합니다.
 */
export const useProjectStore = create<ProjectState>(set => ({
  projects: [],
  isLoading: false,
  error: null,
  setProjects: projects => set({ projects }),
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabaseClient
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ projects: data || [], isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },
}));
