'use client';

import { useTheme } from '@/hooks/useTheme';
import { useEffect, useState } from 'react';
import Button from './ui/Button/Button';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    // 테마가 확정되었을 때만 라벨 설정
    if (theme === 'dark') {
      setLabel('🌙');
    } else if (theme === 'light') {
      setLabel('☀️');
    }
  }, [theme]);

  return <Button onClick={toggleTheme}>{label}</Button>;
};

export default ThemeToggle;
