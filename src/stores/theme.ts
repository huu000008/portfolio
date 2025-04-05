'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light', // placeholder 초기값
      toggleTheme: () => {
        const current = get().theme;
        const next = current === 'light' ? 'dark' : 'light';
        set({ theme: next });
        document.documentElement.dataset.theme = next;
      },
      setTheme: theme => {
        set({ theme });
        document.documentElement.dataset.theme = theme;
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => state => {
        const saved = state?.theme || getSystemTheme();
        state?.setTheme(saved);
      },
    },
  ),
);
