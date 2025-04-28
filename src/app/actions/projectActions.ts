// app/actions/projectActions.ts
'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Project } from '@/types/project';
import { revalidatePath } from 'next/cache';
import { ProjectFormValues } from '@/features/projects/components/ProjectForm';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from './authActions';
import { checkAdminStatus } from '@/lib/authUtils'; // 유틸리티 함수 임포트
import { User } from '@/types/user';
import { toErrorObject } from '@/utils/common';

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

  // console.log(`[DEBUG] 프로젝트 조회 시작: ID=${id}, 타입=${typeof id}`);

  try {
    // ID가 UUID 형식인지 확인
    if (id.includes('-')) {
      // UUID 형식이면 그대로 사용
      // console.log(`[DEBUG] UUID 형식 ID 사용: ${id}`);
    } else {
      // 숫자 ID면 로그 기록
      // console.log(`[DEBUG] 숫자 ID 사용: ${id}`);
    }

    // 쿼리 실행 전 로깅
    // console.log(`[DEBUG] Supabase 쿼리 실행: .from('projects').select('*').eq('id', ${id})`);

    // .single() 대신 배열로 받아서 처리
    const { data, error } = await supabase.from('projects').select('*').eq('id', id);

    // 쿼리 결과 로깅
    // console.log(`[DEBUG] 쿼리 결과:`, {
    //   dataExists: !!data,
    //   dataLength: data?.length,
    //   error: error ? `${error.code}: ${error.message}` : null,
    // });

    if (error) throw new Error(`프로젝트 조회 실패: ${error.message}`);

    // 결과가 없으면 상세 로그 후 404 페이지로
    if (!data || data.length === 0) {
      // console.log(`[DEBUG] 프로젝트를 찾을 수 없음: ID=${id}`);

      notFound();
    }

    // console.log(`[DEBUG] 프로젝트 찾음:`, data[0].id);

    // 첫 번째 항목만 반환 (여러 항목이 있어도 첫 번째만 사용)
    return data[0];
  } catch (error) {
    console.error(`프로젝트 ID ${id} 조회 중 오류 발생:`, error);
    throw error;
  }
}

// User 타입 가드 함수 (모든 필수 속성 검사)
function isUser(obj: unknown): obj is User {
  return (
    !!obj &&
    typeof obj === 'object' &&
    'id' in obj &&
    typeof (obj as { id?: unknown }).id === 'string' &&
    'email' in obj &&
    typeof (obj as { email?: unknown }).email === 'string' &&
    'app_metadata' in obj &&
    'user_metadata' in obj &&
    'aud' in obj &&
    typeof (obj as { aud?: unknown }).aud === 'string' &&
    'created_at' in obj &&
    typeof (obj as { created_at?: unknown }).created_at === 'string'
  );
}

/**
 * 프로젝트 생성 서버 액션
 * 인증된 사용자만 접근 가능
 */
export async function createProjectAction(
  formData: ProjectFormValues,
): Promise<{ data: Project; error: null } | { data: null; error: Error }> {
  try {
    const userResult = await getCurrentUser();
    if (!isUser(userResult)) {
      redirect('/auth/login');
    }
    const user = userResult; // 타입이 User로 확정
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
      user_id: user.id, // 타입 안전하게 접근
    };

    // .single() 대신 배열로 받아서 처리
    const { data, error } = await supabase.from('projects').insert(projectData).select('*');

    if (error) return { data: null, error: toErrorObject(error, '프로젝트 생성 실패') };

    if (!data || data.length === 0) {
      return {
        data: null,
        error: toErrorObject(
          '프로젝트가 생성되었지만 데이터를 가져오지 못했습니다.',
          '프로젝트가 생성되었지만 데이터를 가져오지 못했습니다.',
        ),
      };
    }

    // 캐시 무효화
    revalidatePath('/projects');

    return { data: data[0], error: null };
  } catch (error) {
    console.error('프로젝트 생성 실패:', error);
    return { data: null, error: toErrorObject(error, '프로젝트 생성 중 오류가 발생했습니다.') };
  }
}

/**
 * 프로젝트 수정 서버 액션
 * 인증된 사용자만 접근 가능
 */
export async function updateProjectAction(
  data: ProjectFormValues & { id: string },
): Promise<{ data: Project; error: null } | { data: null; error: Error }> {
  try {
    const userResult = await getCurrentUser();
    if (!isUser(userResult)) {
      redirect('/auth/login');
    }
    const user = userResult; // 타입이 User로 확정
    const supabase = await createServerSupabaseClient();

    // 프로젝트 소유자 확인 - .single() 제거
    const { data: projectData, error: fetchError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', data.id);

    if (fetchError)
      return { data: null, error: toErrorObject(fetchError, '프로젝트 소유자 확인 실패') };

    // 프로젝트가 존재하는지 확인
    if (!projectData || projectData.length === 0) {
      return {
        data: null,
        error: toErrorObject('프로젝트를 찾을 수 없습니다.', '프로젝트를 찾을 수 없습니다.'),
      };
    }

    // user는 isUser 체크로 User 타입이 보장됨
    const userIsAdmin = checkAdminStatus(user); // user: User

    const project = projectData[0];
    if (project.user_id !== user.id && !userIsAdmin) {
      return {
        data: null,
        error: toErrorObject(
          '이 프로젝트를 수정할 권한이 없습니다.',
          '이 프로젝트를 수정할 권한이 없습니다.',
        ),
      };
    }

    // 폼 데이터를 DB 스키마에 맞게 변환
    const projectUpdateData = {
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

    // .single() 제거
    const { data: result, error } = await supabase
      .from('projects')
      .update(projectUpdateData)
      .eq('id', data.id)
      .select('*');

    if (error) return { data: null, error: toErrorObject(error, '프로젝트 업데이트 실패') };

    if (!result || result.length === 0) {
      return {
        data: null,
        error: toErrorObject(
          '프로젝트가 업데이트되었지만 데이터를 가져오지 못했습니다.',
          '프로젝트가 업데이트되었지만 데이터를 가져오지 못했습니다.',
        ),
      };
    }

    // 캐시 무효화
    revalidatePath('/projects');
    revalidatePath(`/projects/${data.id}`);

    return { data: result[0], error: null };
  } catch (error) {
    console.error('프로젝트 수정 실패:', error);
    return { data: null, error: toErrorObject(error, '프로젝트 수정 중 오류가 발생했습니다.') };
  }
}

/**
 * 프로젝트 삭제 서버 액션
 * 인증된 사용자만 접근 가능
 * 삭제 성공 시 프로젝트 목록 페이지로 자동 리다이렉트
 */
export async function deleteProjectAction(
  id: string,
): Promise<{ success: boolean; error?: Error }> {
  try {
    const userResult = await getCurrentUser();
    if (!isUser(userResult)) {
      redirect('/auth/login');
    }
    const user = userResult; // 타입이 User로 확정
    const supabase = await createServerSupabaseClient();

    // 프로젝트 소유자 확인 - .single() 제거
    const { data: projectData, error: fetchError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', id);

    if (fetchError)
      return { success: false, error: toErrorObject(fetchError, '프로젝트 소유자 확인 실패') };

    // 프로젝트가 존재하는지 확인
    if (!projectData || projectData.length === 0) {
      return {
        success: false,
        error: toErrorObject('프로젝트를 찾을 수 없습니다.', '프로젝트를 찾을 수 없습니다.'),
      };
    }

    // user는 isUser 체크로 User 타입이 보장됨
    const userIsAdmin = checkAdminStatus(user); // user: User

    const project = projectData[0];
    if (project.user_id !== user.id && !userIsAdmin) {
      return {
        success: false,
        error: toErrorObject(
          '이 프로젝트를 삭제할 권한이 없습니다.',
          '이 프로젝트를 삭제할 권한이 없습니다.',
        ),
      };
    }

    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) return { success: false, error: toErrorObject(error, '프로젝트 삭제 실패') };

    // 캐시 무효화
    revalidatePath('/projects');

    // console.log(`프로젝트 ID ${id} 삭제 성공. 프로젝트 목록 페이지로 리다이렉트합니다.`);

    // 성공적으로 삭제 후 프로젝트 목록 페이지로 리다이렉트
    redirect('/projects');

    // 아래 코드는 리다이렉트 후에는 실행되지 않음
    return { success: true };
  } catch (error) {
    console.error('프로젝트 삭제 실패:', error);
    return { success: false, error: toErrorObject(error, '프로젝트 삭제 중 오류가 발생했습니다.') };
  }
}
