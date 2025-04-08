'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

/**
 * 애플리케이션 전체에 React Query 프로바이더를 제공하는 컴포넌트
 */
export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          staleTime: 5 * 60 * 1000, // 5분
          gcTime: 10 * 60 * 1000, // 10분
          refetchOnWindowFocus: false,
        },
        mutations: {
          retry: false,
        },
      },
    });
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
