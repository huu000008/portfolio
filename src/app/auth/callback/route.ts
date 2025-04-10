import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

/**
 * Supabase 인증 콜백 처리 라우트 핸들러
 * 이메일 인증 링크를 클릭했을 때 처리하는 라우트
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // 인증 완료 후 홈페이지로 리다이렉션
  return Response.redirect(new URL('/', requestUrl));
}
