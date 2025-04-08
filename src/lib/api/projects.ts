/**
 * 프로젝트 관련 서버 컴포넌트에서 사용할 데이터 페칭 함수
 */
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Project } from '@/types/project';
import { notFound } from 'next/navigation';

/**
 * 모든 프로젝트 목록을 가져오는 함수 (서버 컴포넌트용)
 */
export async function getProjectsServer(): Promise<Project[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`프로젝트 목록 조회 실패: ${error.message}`);
  return data || [];
}

/**
 * 특정 ID의 프로젝트를 가져오는 함수 (서버 컴포넌트용)
 */
export async function getProjectByIdServer(id: string): Promise<Project | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();

  if (error) throw new Error(`프로젝트 조회 실패: ${error.message}`);
  if (!data || data.length === 0) notFound();

  return data;
}
