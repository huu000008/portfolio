// lib/supabase/server.ts
/**
 * Supabase 서버 클라이언트 모듈
 * 서버 컴포넌트에서만 사용할 수 있는 Supabase 클라이언트 생성 함수
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// 환경 변수
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * 서버 컴포넌트에서 사용할 Supabase 클라이언트 생성 함수
 */
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get: name => cookieStore.get(name)?.value ?? '',
      set: (name, value, options) => {
        try {
          cookieStore.set(name, value, {
            path: '/',
            ...options,
          });
        } catch (error) {
          // Next.js의 ReadonlyRequestCookies에서는 set이 동작하지 않을 수 있음
          console.warn('쿠키 설정 에러:', error);
        }
      },
      remove: name => {
        try {
          cookieStore.set(name, '', { maxAge: 0 });
        } catch (error) {
          // Next.js의 ReadonlyRequestCookies에서는 set이 동작하지 않을 수 있음
          console.warn('쿠키 삭제 에러:', error);
        }
      },
    },
  });
};
