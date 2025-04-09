// hooks/useProjects.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project } from '@/types/project';
import {
  fetchProjectsAction,
  fetchProjectByIdAction,
  deleteProjectAction,
  createProjectAction,
  updateProjectAction,
} from '@/app/actions/projectActions';
import { ProjectFormValues } from '@/features/projects/components/ProjectForm';

// 쿼리 키 상수
export const PROJECTS_QUERY_KEY = 'projects';

// 컨텍스트 타입 정의
interface MutationContext {
  previousProjects?: Project[];
  previousProject?: Project;
}

/**
 * 공통 뮤테이션 설정 생성 훅
 * 중복 코드를 줄이고 일관된 설정을 유지하기 위한 커스텀 훅
 */
function useMutationOptions<TData, TVariables, TContext extends MutationContext = MutationContext>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    onMutateHandler?: (variables: TVariables) => Promise<TContext>;
    customQueryKey?: (variables: TVariables) => readonly unknown[];
  } = {},
) {
  const queryClient = useQueryClient();
  const { onMutateHandler, customQueryKey } = options;

  return {
    mutationFn,

    onMutate: async (variables: TVariables): Promise<TContext> => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: [PROJECTS_QUERY_KEY] });

      // 특정 항목에 대한 쿼리도 취소 (해당되는 경우)
      if (customQueryKey) {
        await queryClient.cancelQueries({ queryKey: customQueryKey(variables) });
      }

      // 현재 데이터 스냅샷 저장
      const previousProjects = queryClient.getQueryData<Project[]>([PROJECTS_QUERY_KEY]);

      // 사용자 정의 낙관적 업데이트 처리
      if (onMutateHandler) {
        return onMutateHandler(variables);
      }

      return { previousProjects } as TContext;
    },

    onSuccess: (_: TData, variables: TVariables) => {
      // 모든 프로젝트 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });

      // 특정 프로젝트 쿼리 무효화 (해당되는 경우)
      if (customQueryKey) {
        queryClient.invalidateQueries({ queryKey: customQueryKey(variables) });
      }
    },

    onError: (_: Error, variables: TVariables, context: TContext | undefined) => {
      // 에러시 이전 상태로 롤백
      if (context?.previousProjects) {
        queryClient.setQueryData([PROJECTS_QUERY_KEY], context.previousProjects);
      }

      // 특정 항목 롤백 (해당되는 경우)
      if (context?.previousProject && customQueryKey) {
        queryClient.setQueryData(customQueryKey(variables), context.previousProject);
      }
    },

    retry: 1,
    retryDelay: 1000,
  };
}

/**
 * 프로젝트 목록 조회 훅
 */
export const useProjects = () => {
  return useQuery<Project[], Error>({
    queryKey: [PROJECTS_QUERY_KEY],
    queryFn: () => fetchProjectsAction() as Promise<Project[]>,
  });
};

/**
 * 단일 프로젝트 조회 훅
 */
export const useProject = (id: string) => {
  return useQuery<Project, Error>({
    queryKey: [PROJECTS_QUERY_KEY, id],
    queryFn: () => fetchProjectByIdAction(id),
    enabled: !!id,
  });
};

/**
 * 프로젝트 삭제 훅
 */
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const options = useMutationOptions<{ success: boolean }, string, MutationContext>(
    deleteProjectAction,
    {
      onMutateHandler: async id => {
        const previousProjects = queryClient.getQueryData<Project[]>([PROJECTS_QUERY_KEY]);

        // 낙관적 업데이트: 목록에서 항목 제거
        if (previousProjects) {
          queryClient.setQueryData(
            [PROJECTS_QUERY_KEY],
            previousProjects.filter(project => project.id !== id),
          );
        }

        // 특정 프로젝트 데이터 캐시에서 제거
        queryClient.removeQueries({ queryKey: [PROJECTS_QUERY_KEY, id] });

        return { previousProjects };
      },
      customQueryKey: (id: string) => [PROJECTS_QUERY_KEY, id] as const,
    },
  );

  return useMutation<{ success: boolean }, Error, string, MutationContext>(options);
};

/**
 * 프로젝트 생성 훅
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const options = useMutationOptions<
    { data: Project; error: null } | { data: null; error: Error },
    ProjectFormValues,
    MutationContext
  >(createProjectAction, {
    onMutateHandler: async () => {
      const previousProjects = queryClient.getQueryData<Project[]>([PROJECTS_QUERY_KEY]);
      return { previousProjects };
    },
  });

  return useMutation<
    { data: Project; error: null } | { data: null; error: Error },
    Error,
    ProjectFormValues,
    MutationContext
  >(options);
};

/**
 * 프로젝트 수정 훅
 */
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const options = useMutationOptions<
    { data: Project; error: null } | { data: null; error: Error },
    ProjectFormValues & { id: string },
    MutationContext
  >(updateProjectAction, {
    onMutateHandler: async (updatedProject: ProjectFormValues & { id: string }) => {
      const previousProjects = queryClient.getQueryData<Project[]>([PROJECTS_QUERY_KEY]);
      const previousProject = queryClient.getQueryData<Project>([
        PROJECTS_QUERY_KEY,
        updatedProject.id,
      ]);

      // 낙관적 업데이트: 목록의 항목 갱신
      if (previousProjects) {
        queryClient.setQueryData(
          [PROJECTS_QUERY_KEY],
          previousProjects.map(project =>
            project.id === updatedProject.id ? { ...project, ...updatedProject } : project,
          ),
        );
      }

      // 낙관적 업데이트: 특정 항목 갱신
      if (previousProject) {
        queryClient.setQueryData([PROJECTS_QUERY_KEY, updatedProject.id], {
          ...previousProject,
          ...updatedProject,
        });
      }

      return { previousProjects, previousProject };
    },
    customQueryKey: variables => [PROJECTS_QUERY_KEY, variables.id] as const,
  });

  return useMutation<
    { data: Project; error: null } | { data: null; error: Error },
    Error,
    ProjectFormValues & { id: string },
    MutationContext
  >(options);
};
