import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

// 날짜 → YYYY-MM-DD
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const localDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// 날짜 → "3분 전", "2달 전"
export function formatRelativeTime(isoDate: string): string {
  return formatDistanceToNow(new Date(isoDate), {
    addSuffix: true,
    locale: ko,
  });
}
