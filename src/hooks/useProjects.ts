'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project } from '@/types/project';
import { supabaseClient } from '@/lib/supabase/client';

// 쿼리 키 상수
const PROJECTS_QUERY_KEY = 'projects';

/**
 * 프로젝트 목록을 가져오는 함수
 */
const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabaseClient
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * 프로젝트 상세 정보를 가져오는 함수
 */
const fetchProjectById = async (id: string): Promise<Project | null> => {
  const { data, error } = await supabaseClient.from('projects').select('*').eq('id', id).single();

  if (error) return null;
  return data;
};

/**
 * 프로젝트를 삭제하는 함수
 */
const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabaseClient.from('projects').delete().eq('id', id);

  if (error) throw error;
};

/**
 * 프로젝트 목록을 가져오는 훅
 */
export const useProjects = () => {
  return useQuery({
    queryKey: [PROJECTS_QUERY_KEY],
    queryFn: fetchProjects,
  });
};

/**
 * 프로젝트 상세 정보를 가져오는 훅
 */
export const useProject = (id: string) => {
  return useQuery({
    queryKey: [PROJECTS_QUERY_KEY, id],
    queryFn: () => fetchProjectById(id),
    enabled: !!id,
  });
};

/**
 * 프로젝트 삭제 훅
 */
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      // 삭제 성공 시 프로젝트 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
    },
  });
};
