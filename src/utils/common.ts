import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// 에러 메시지 추출용 (UI/토스트/폼 등)
export function extractErrorMessage(
  error: unknown,
  defaultMsg = '알 수 없는 오류가 발생했습니다.',
): string {
  if (error instanceof Error) return error.message;
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }
  if (typeof error === 'string') return error;
  return defaultMsg;
}

// Error 객체 반환용 (서버 액션 등)
export function toErrorObject(
  error: unknown,
  defaultMsg = '알 수 없는 오류가 발생했습니다.',
): Error {
  if (error instanceof Error) return error;
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    return new Error((error as { message: string }).message);
  }
  if (typeof error === 'string') return new Error(error);
  return new Error(defaultMsg);
}
