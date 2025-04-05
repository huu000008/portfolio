'use client';

import { useRouter } from 'next/navigation';

export const useViewTransition = () => {
  const router = useRouter();

  const transitionNavigate = (href: string) => {
    if (!document.startViewTransition) {
      router.push(href);
      return;
    }

    document.startViewTransition(() => {
      router.push(href);
    });
  };

  return { transitionNavigate };
};
