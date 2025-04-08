'use client';

import { useTheme } from '@/hooks/useTheme';
import { useEffect, useState } from 'react';
import Button from './ui/Button/Button';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [label, setLabel] = useState('☀️'); // placeholder 렌더

  useEffect(() => {
    if (theme === 'dark') {
      setLabel('🌙');
    } else if (theme === 'light') {
      setLabel('☀️');
    }
  }, [theme]);

  return <Button onClick={toggleTheme}>{label}</Button>;
};

export default ThemeToggle;
