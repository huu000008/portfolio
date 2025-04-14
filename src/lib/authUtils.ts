import { User } from '@supabase/supabase-js';

/**
 * 주어진 사용자가 관리자인지 확인합니다.
 * NEXT_PUBLIC_ADMIN_EMAILS 환경 변수를 사용합니다.
 * @param user Supabase 사용자 객체 또는 null
 * @returns 사용자가 관리자이면 true, 아니면 false
 */
export function checkAdminStatus(user: User | null): boolean {
  if (!user || !user.email) return false;

  // 환경 변수에서 관리자 이메일 목록 읽기 (쉼표로 구분)
  const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
  const adminEmails = adminEmailsEnv
    .split(',')
    .map(email => email.trim())
    .filter(email => email);

  if (adminEmails.length === 0) {
    // 환경 변수가 설정되지 않았을 경우 경고 로그는 각 호출 위치에서 필요에 따라 처리하는 것이 좋음
    // console.warn('[AuthUtils] 관리자 이메일이 설정되지 않았습니다. NEXT_PUBLIC_ADMIN_EMAILS 환경 변수를 확인하세요.');
    return false;
  }

  return adminEmails.includes(user.email);
}
