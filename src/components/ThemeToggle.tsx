'use client';

import { useTheme } from '@/hooks/useTheme';
import { useEffect, useState } from 'react';

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

  return <button onClick={toggleTheme}>{label}</button>;
};
