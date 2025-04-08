/**
 * Supabase 클라이언트 통합 모듈
 * 이 파일은 클라이언트 모듈만 내보냅니다.
 * 서버 컴포넌트에서는 server.ts를 직접 import해야 합니다.
 */

// 클라이언트 컴포넌트에서 사용할 함수와 인스턴스 내보내기
export { createBrowserSupabaseClient, supabaseClient, supabase } from './client';

// 서버 컴포넌트 함수는 더 이상 여기서 내보내지 않습니다.
// 서버 컴포넌트에서는 직접 './server'에서 import 해야 합니다.
