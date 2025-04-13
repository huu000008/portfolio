// lib/supabase/server.ts
/**
 * Supabase 서버 클라이언트 모듈
 *
 * 이 모듈은 Next.js 서버 컴포넌트와 Server Actions에서만 사용해야 합니다.
 * React 19와 Next.js 15에서는 서버/클라이언트 컴포넌트가 명확하게 분리되어 있습니다.
 *
 * 중요: cookies() API는 오직 서버 컴포넌트와 Server Actions에서만 호출할 수 있습니다.
 * 클라이언트 컴포넌트에서 이 함수를 직접/간접적으로 호출하면 런타임 에러가 발생합니다.
 *
 * React 19 특징:
 * - 향상된 서버 컴포넌트 지원
 * - 자동 Promise Unwrapping
 * - 성능 최적화
 * - 개선된 세션 관리 및 인증 상태 동기화
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// 환경 변수
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * 서버 컴포넌트에서 사용할 Supabase 클라이언트 생성 함수
 *
 * @returns Supabase 서버 클라이언트 인스턴스
 *
 * 사용 예시:
 * ```tsx
 * // 서버 컴포넌트에서:
 * export default async function MyServerComponent() {
 *   const supabase = await createServerSupabaseClient();
 *   const { data } = await supabase.from('my_table').select('*');
 *   return <div>{JSON.stringify(data)}</div>;
 * }
 *
 * // Server Action에서:
 * export async function myServerAction() {
 *   'use server';
 *   const supabase = await createServerSupabaseClient();
 *   // ...
 * }
 * ```
 *
 * React 19 특징:
 * - 향상된 오류 처리: 더 명확한 오류 메시지와 디버깅 정보
 * - 서버 컴포넌트와 Server Actions에서 더 효율적인 작동
 */
export async function createServerSupabaseClient() {
  // cookies() 함수는 React 19에서 서버 컴포넌트에서만 사용할 수 있으며
  // 이 함수를 호출하는 컴포넌트는 반드시 서버 컴포넌트여야 합니다.
  // Next.js 15.2.4에서는 cookies()가 Promise를 반환하므로 await를 사용해야 합니다.
  const cookieStore = await cookies();

  // @supabase/ssr의 createServerClient 사용
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set(name, value, options) {
        try {
          cookieStore.set(name, value, {
            path: '/',
            ...options,
          });
        } catch (error) {
          // ReadonlyRequestCookies 에러 처리
          console.warn(
            '쿠키 설정 에러: Route Handler나 읽기 전용 컨텍스트에서 발생할 수 있습니다.',
            error,
          );
        }
      },
      remove(name, options) {
        try {
          cookieStore.set(name, '', {
            ...options,
            path: '/',
            maxAge: 0,
          });
        } catch (error) {
          console.warn(
            '쿠키 삭제 에러: Route Handler나 읽기 전용 컨텍스트에서 발생할 수 있습니다.',
            error,
          );
        }
      },
    },
  });
}
