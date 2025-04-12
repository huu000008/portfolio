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

  // 테마가 아직 확정되지 않았다면 아무것도 렌더링하지 않음
  if (label === null) return null;

  return <Button onClick={toggleTheme}>{label}</Button>;
};

export default ThemeToggle;
