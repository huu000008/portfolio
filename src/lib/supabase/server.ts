/**
 * Supabase 서버 클라이언트 모듈
 * Next.js 서버 컴포넌트와 Server Actions에서만 사용
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { CookieOptions } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 타입 정의
interface ModifiableCookieStore {
  canModify: () => boolean;
}

// 쿠키 저장소가 수정 가능한지 안전하게 확인
function isCookieContextModifiable(cookieStore: unknown): boolean {
  if (
    typeof cookieStore === 'object' &&
    cookieStore !== null &&
    'canModify' in cookieStore &&
    typeof (cookieStore as Record<string, unknown>).canModify === 'function'
  ) {
    return (cookieStore as ModifiableCookieStore).canModify() !== false;
  }
  return true;
}

/**
 * 서버 컴포넌트용 Supabase 클라이언트 생성 함수
 * @returns Supabase 서버 클라이언트 인스턴스
 */
export async function createServerSupabaseClient() {
  // Promise를 반환하므로 await 필수
  const cookieStore = await cookies();
  const isModifiable = isCookieContextModifiable(cookieStore);

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },

      set(name: string, value: string, options?: CookieOptions) {
        try {
          if (isModifiable) {
            cookieStore.set(name, value, {
              path: '/',
              ...options,
            });
          } else {
            console.warn('[Supabase] 읽기 전용 컨텍스트에서 쿠키 설정 시도가 무시됩니다.', {
              name,
              value,
            });
          }
        } catch (error) {
          console.warn('[Supabase] 쿠키 설정 에러:', {
            name,
            error: error instanceof Error ? error.message : String(error),
            context: 'server',
          });
        }
      },

      remove(name: string, options?: CookieOptions) {
        try {
          if (isModifiable) {
            cookieStore.set(name, '', {
              ...options,
              path: '/',
              maxAge: 0,
            });
          } else {
            console.warn('[Supabase] 읽기 전용 컨텍스트에서 쿠키 삭제 시도가 무시됩니다.', {
              name,
            });
          }
        } catch (error) {
          console.warn('[Supabase] 쿠키 삭제 에러:', {
            name,
            error: error instanceof Error ? error.message : String(error),
            context: 'server',
          });
        }
      },
    },
  });
}
