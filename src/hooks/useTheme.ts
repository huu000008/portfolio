'use client';

import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

declare global {
  interface Window {
    __THEME_DATA__?: Theme;
  }
}

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme | undefined>(undefined);

  useEffect(() => {
    // 테마 우선순위:
    // 1. 로컬 스토리지에 저장된 테마
    // 2. window.__THEME_DATA__(서버에서 전달된 테마)
    // 3. 시스템 기본 설정
    // 4. 기본값 'light'
    const getInitialTheme = (): Theme => {
      if (typeof window === 'undefined') return 'light';

      // 1. 로컬 스토리지 확인
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }

      // 2. window.__THEME_DATA__ 확인
      if (window.__THEME_DATA__ === 'light' || window.__THEME_DATA__ === 'dark') {
        return window.__THEME_DATA__;
      }

      // 3. 시스템 기본 설정 확인
      if (typeof window.matchMedia === 'function') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) return 'dark';
      }

      // 4. 기본값
      return 'light';
    };

    const initialTheme = getInitialTheme();

    // 상태 및 DOM 업데이트
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;

    // 로컬 스토리지에 저장
    localStorage.setItem('theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    if (!theme) return;

    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  return { theme, toggleTheme };
};
