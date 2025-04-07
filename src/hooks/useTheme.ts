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
    const initialTheme =
      typeof window !== 'undefined' && window.__THEME_DATA__ ? window.__THEME_DATA__ : 'light';

    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  const toggleTheme = () => {
    if (!theme) return;

    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  const getInitialThemeFromDOM = (): 'light' | 'dark' | '' => {
    if (typeof document === 'undefined') return '';
    const attr = document.documentElement.dataset.theme;
    return attr === 'dark' || attr === 'light' ? attr : '';
  };

  const initialLabel =
    theme === 'dark'
      ? '🌙 다크 모드'
      : theme === 'light'
        ? '☀️ 라이트 모드'
        : getInitialThemeFromDOM() === 'dark'
          ? '🌙 다크 모드'
          : getInitialThemeFromDOM() === 'light'
            ? '☀️ 라이트 모드'
            : '';

  return { theme, toggleTheme, initialLabel };
};
