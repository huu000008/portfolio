'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { toast } from '@/utils/toast';

// 관리자로 지정할 이메일 주소 목록
const ADMIN_EMAILS = ['sqwasd@naver.com']; // 실제 관리자 이메일로 변경 필요

// 세션 관련 상수
const SESSION_REFRESH_INTERVAL = 60 * 60 * 1000; // 1시간마다 세션 갱신
const INACTIVITY_LOGOUT_TIME = 30 * 60 * 1000; // 30분 무활동 시 자동 로그아웃

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  fetchSession: () => Promise<void>;
  isAdmin: () => boolean;
}

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
      // console.log('Fetched session:', session);
      // 상태 업데이트를 동기적으로 처리
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching session:', error);
      setIsLoading(false);
    }
  };

  // 세션 갱신 함수
  const refreshSession = async () => {
    try {
      const { error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('세션 갱신 실패:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('세션 갱신 중 오류 발생:', error);
      return false;
    }
  };

  // 세션 만료 감지 함수
  const checkSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session && user) {
      // 세션이 만료됨
      toast.warning('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
      router.push('/auth/login');
    }
  }, [user, router]);

  // 로그아웃 함수
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      // 상태 업데이트는 onAuthStateChange 리스너가 처리하고 router.refresh()도 호출합니다.
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [router]);

  useEffect(() => {
    // 초기 세션 로드
    fetchSession();

    // 인증 상태 변경 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // console.log('Auth state changed:', event, session);

      // 상태 변경 시 즉시 업데이트
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      // 로그인/로그아웃 이벤트 처리
      if (event === 'SIGNED_IN') {
        // console.log('SIGNED_IN event detected, updating state');
        await fetchSession();
      } else if (event === 'SIGNED_OUT') {
        // console.log('SIGNED_OUT event detected, clearing state');
        setSession(null);
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 세션 갱신 및 만료 감지 로직
  useEffect(() => {
    if (!user) return; // 로그인되지 않은 경우 실행하지 않음

    // 세션 갱신 인터벌 설정
    const refreshInterval = setInterval(() => {
      refreshSession();
    }, SESSION_REFRESH_INTERVAL);

    // 페이지 포커스 시 세션 확인
    const handleFocus = () => {
      checkSession();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user, checkSession]);

  // 자동 로그아웃 타이머
  useEffect(() => {
    if (!user) return; // 로그인되지 않은 경우 실행하지 않음

    let logoutTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(async () => {
        await signOut();
        toast.info('장시간 활동이 없어 자동 로그아웃 되었습니다.');
      }, INACTIVITY_LOGOUT_TIME);
    };

    // 사용자 활동 감지
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('click', resetTimer);

    resetTimer(); // 초기 타이머 설정

    return () => {
      clearTimeout(logoutTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [user, signOut]);

  // 관리자 여부 확인 함수
  const isAdmin = useCallback(() => {
    if (!user) return false;
    return ADMIN_EMAILS.includes(user.email || '');
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signOut,
        fetchSession,
        isAdmin,
      }}
    >
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
