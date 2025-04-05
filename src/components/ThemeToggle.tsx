'use client';

import { useThemeStore } from '@/stores/theme';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button onClick={toggleTheme}>{theme === 'dark' ? '🌙 다크 모드' : '☀️ 라이트 모드'}</button>
  );
};
