import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * ISO 날짜를 YYYY-MM-DD 포맷으로 반환
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const localDate = new Date(date.getTime() + 9 * 60 * 60 * 1000); // 한국 시간

  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * 날짜 → "3분 전", "2달 전"
 */
export function formatRelativeTime(isoDate: string): string {
  return formatDistanceToNow(new Date(isoDate), {
    addSuffix: true,
    locale: ko,
  });
}

/**
 * "2023-01-31T00:00:00Z ~ 2023-03-01T00:00:00Z" 형식에서 종료일만 추출
 */
export function getPeriodEnd(period: string): string {
  return period.split('~')[1]?.trim() ?? '';
}

/**
 * 종료일이 아직 안 지났으면 "진행중", 지났으면 상대 시간 반환
 */
export function formatRelativeTimeOrInProgress(isoDate: string): string {
  const now = new Date();
  const end = new Date(isoDate);

  if (end.getTime() > now.getTime()) {
    return '진행중';
  }

  return formatRelativeTime(isoDate);
}
