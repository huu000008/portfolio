'use client';

/**
 * Supabase 클라이언트 모듈
 * 클라이언트 컴포넌트에서 사용할 수 있는 Supabase 인스턴스 제공
 */

import { createBrowserClient } from '@supabase/ssr';

// 환경 변수
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * 클라이언트 컴포넌트에서 사용할 Supabase 클라이언트 생성 함수
 */
export const createBrowserSupabaseClient = () => {
  return createBrowserClient(supabaseUrl, supabaseKey);
};

// 클라이언트 컴포넌트에서 바로 사용할 수 있는 인스턴스
export const supabaseClient = createBrowserSupabaseClient();

// 간편한 사용을 위한 별칭
export const supabase = supabaseClient;
