'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import styles from './ThemeToggle.module.scss';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <Button
      size="icon"
      className={styles.themeToggleButton}
      onClick={toggleTheme}
      aria-label="테마 변경"
    >
      <Sun className={styles.sunIcon} />
      <Moon className={styles.moonIcon} />
    </Button>
  );
}
