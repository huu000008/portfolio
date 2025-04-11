'use client';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Project } from '@/types/project';
import { supabaseClient } from '@/lib/supabase/client';
import { fetchProjectsAction } from '@/app/actions/projectActions';

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: Error | null;
  fetchProjects: () => Promise<void>;
  fetchProjectsFromServer: () => Promise<void>;
  setProjects: (projects: Project[]) => void;
  refreshProjects: () => Promise<void>;
}

/**
 * 프로젝트 상태를 관리하는 스토어
 * Zustand + immer를 사용하여 React 19 환경에서 최적화된 상태 관리
 *
 * React 19 최적화 포인트:
 * - immer로 불변성 관리 효율화
 * - 서버 액션 통합으로 데이터 페칭 최적화
 * - 세분화된 상태 업데이트로 리렌더링 최소화
 */
export const useProjectStore = create<ProjectState>()(
  immer((set, get) => ({
    projects: [],
    isLoading: false,
    error: null,

    // 클라이언트에서 직접 프로젝트 설정 (서버 데이터 활용)
    setProjects: projects => {
      set(state => {
        state.projects = projects;
      });
    },

    // Supabase 클라이언트에서 직접 데이터 페칭 (기존 방식)
    fetchProjects: async () => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const { data, error } = await supabaseClient
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        set(state => {
          state.projects = data || [];
          state.isLoading = false;
        });
      } catch (error) {
        set(state => {
          state.error = error as Error;
          state.isLoading = false;
        });
      }
    },

    // Server Action을 통한 데이터 페칭 (React 19 최적화)
    fetchProjectsFromServer: async () => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // 서버 액션을 통해 데이터 페칭
        const data = await fetchProjectsAction();

        set(state => {
          state.projects = data;
          state.isLoading = false;
        });
      } catch (error) {
        set(state => {
          state.error = error as Error;
          state.isLoading = false;
        });
      }
    },

    // 최적화된 리프레시 함수 - 현재 데이터가 있으면 새로고침만, 없으면 로딩 표시
    refreshProjects: async () => {
      const hasProjects = get().projects.length > 0;

      // 이미 데이터가 있으면 조용히 리프레시
      if (hasProjects) {
        try {
          const data = await fetchProjectsAction();
          set(state => {
            state.projects = data;
          });
        } catch (error) {
          set(state => {
            state.error = error as Error;
          });
        }
      } else {
        // 데이터가 없으면 로딩 상태로 페칭
        await get().fetchProjectsFromServer();
      }
    },
  })),
);
