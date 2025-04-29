import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 여러 클래스명을 병합하는 유틸리티 함수
 * clsx로 클래스명을 결합하고 tailwind-merge로 Tailwind 클래스를 최적화합니다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
