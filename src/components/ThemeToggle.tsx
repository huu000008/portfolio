'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="테마 토글" className="relative" disabled>
        <Sun className="h-5 w-5 opacity-0" />
        <Moon className="absolute h-5 w-5 opacity-0" />
        <span className="sr-only">테마 변경</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="테마 토글"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative"
    >
      <Sun
        className={`h-5 w-5 transition-all duration-300 ${theme === 'dark' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      />
      <Moon
        className={`absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${theme === 'dark' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
      />
      <span className="sr-only">테마 변경</span>
    </Button>
  );
};

export default ThemeToggle;
