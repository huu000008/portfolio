// app/actions/projectActions.ts
'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Project } from '@/types/project';
import { revalidatePath } from 'next/cache';
import { ProjectFormValues } from '@/features/projects/components/ProjectForm';
import { notFound } from 'next/navigation';

/**
 * 프로젝트 목록 조회 서버 액션
 * @returns 프로젝트 배열
 */
export async function fetchProjectsAction(): Promise<Project[]> {
  const supabase = await createServerSupabaseClient();

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`프로젝트 목록 조회 실패: ${error.message}`);

    return data || [];
  } catch (error) {
    console.error('프로젝트 목록 조회 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 특정 ID의 프로젝트 조회 서버 액션
 * @param id 프로젝트 ID
 * @returns 프로젝트 객체 또는 null
 */
export async function fetchProjectByIdAction(id: string): Promise<Project> {
  const supabase = await createServerSupabaseClient();

  try {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();

    if (error) throw new Error(`프로젝트 조회 실패: ${error.message}`);
    if (!data) notFound();

    return data;
  } catch (error) {
    console.error(`프로젝트 ID ${id} 조회 중 오류 발생:`, error);
    throw error;
  }
}

/**
 * 프로젝트 생성 서버 액션
 */
export async function createProjectAction(
  formData: ProjectFormValues,
): Promise<{ data: Project; error: null } | { data: null; error: Error }> {
  try {
    const supabase = await createServerSupabaseClient();

    // 폼 데이터를 DB 스키마에 맞게 변환
    const projectData = {
      title: formData.title,
      description: formData.description,
      project_period: formData.projectPeriod,
      team: formData.team,
      roles: formData.roles,
      tech_stack: formData.techStack,
      contributions: formData.contributions,
      achievements: formData.achievements,
      retrospective: formData.retrospective,
      thumbnail_url: formData.thumbnailUrl || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select('*')
      .single();

    if (error) throw new Error(error.message);

    // 캐시 무효화
    revalidatePath('/projects');

    return { data, error: null };
  } catch (error) {
    console.error('프로젝트 생성 실패:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('프로젝트 생성 중 오류가 발생했습니다'),
    };
  }
}

/**
 * 프로젝트 수정 서버 액션
 */
export async function updateProjectAction(
  data: ProjectFormValues & { id: string },
): Promise<{ data: Project; error: null } | { data: null; error: Error }> {
  try {
    const supabase = await createServerSupabaseClient();

    // 폼 데이터를 DB 스키마에 맞게 변환
    const projectData = {
      title: data.title,
      description: data.description,
      project_period: data.projectPeriod,
      team: data.team,
      roles: data.roles,
      tech_stack: data.techStack,
      contributions: data.contributions,
      achievements: data.achievements,
      retrospective: data.retrospective,
      thumbnail_url: data.thumbnailUrl || null,
      updated_at: new Date().toISOString(),
    };

    const { data: result, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', data.id)
      .select('*')
      .single();

    if (error) throw new Error(error.message);

    // 캐시 무효화
    revalidatePath('/projects');
    revalidatePath(`/projects/${data.id}`);

    return { data: result, error: null };
  } catch (error) {
    console.error('프로젝트 수정 실패:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('프로젝트 수정 중 오류가 발생했습니다'),
    };
  }
}

/**
 * 프로젝트 삭제 서버 액션
 */
export async function deleteProjectAction(id: string): Promise<{ success: boolean }> {
  try {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) throw new Error(error.message);

    // 캐시 무효화
    revalidatePath('/projects');
    revalidatePath(`/projects/${id}`);

    return { success: true };
  } catch (error) {
    console.error('프로젝트 삭제 실패:', error);
    throw error;
  }
}
