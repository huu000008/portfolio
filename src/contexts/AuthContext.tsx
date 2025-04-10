'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  fetchSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 세션 정보를 가져오는 함수
  const fetchSession = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log('Fetched session:', session);
      // 상태 업데이트를 동기적으로 처리
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching session:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 초기 세션 로드
    fetchSession();

    // 인증 상태 변경 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);

      // 상태 변경 시 즉시 업데이트
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      // 로그인/로그아웃 이벤트 처리
      if (event === 'SIGNED_IN') {
        console.log('SIGNED_IN event detected, updating state');
        await fetchSession();
      } else if (event === 'SIGNED_OUT') {
        console.log('SIGNED_OUT event detected, clearing state');
        setSession(null);
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // 상태 업데이트는 onAuthStateChange 리스너가 처리하고 router.refresh()도 호출합니다.
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut, fetchSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
