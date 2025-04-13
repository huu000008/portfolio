'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { toast } from '@/utils/toast';

// 관리자로 지정할 이메일 주소 목록
const ADMIN_EMAILS = ['sqwasd@naver.com']; // 실제 관리자 이메일로 변경 필요

// 세션 관련 상수
const SESSION_REFRESH_INTERVAL = 15 * 60 * 1000; // 15분마다 세션 갱신 (기존 1시간에서 단축)
const INACTIVITY_LOGOUT_TIME = 30 * 60 * 1000; // 30분 무활동 시 자동 로그아웃
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000; // 5분마다 세션 유효성 확인

// 인터페이스 정의
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  fetchSession: () => Promise<void>;
  isAdmin: () => boolean;
}

// 컨텍스트 생성 - 훅을 사용하지 않는 부분
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider 컴포넌트 - 모든 훅은 이 함수 컴포넌트 내부에서만 사용
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  // 마지막 활동 시간 참조 - 컴포넌트 최상위 레벨에서 useRef 사용
  const lastActivityRef = useRef<number>(Date.now());

  // 세션 정보를 가져오는 함수
  const fetchSession = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      // 상태 업데이트를 동기적으로 처리
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching session:', error);
      setIsLoading(false);
    }
  }, []); // 외부 의존성이 없으므로 빈 배열 유지

  // 세션 갱신 함수
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('세션 갱신 실패:', error);
        return false;
      }

      // 세션 갱신 성공 시 상태 업데이트
      if (data && data.session) {
        setSession(data.session);
        setUser(data.session.user);
      }

      return true;
    } catch (error) {
      console.error('세션 갱신 중 오류 발생:', error);
      return false;
    }
  }, []); // 외부 의존성이 없으므로 빈 배열 유지

  // 세션 만료 감지 함수
  const checkSession = useCallback(async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const currentUser = user; // 클로저를 통해 현재 user 상태 캡처

      // 세션이 없지만 사용자 상태는 있는 경우 (세션 만료)
      if (!data.session && currentUser) {
        // 세션 갱신 시도
        const refreshResult = await refreshSession();

        // 갱신 실패 시 로그아웃 처리
        if (!refreshResult) {
          toast.warning('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
          // signOut 함수를 직접 호출하지 않고 내부 로직 구현
          try {
            await supabase.auth.signOut();
            // 상태 명시적 업데이트
            setSession(null);
            setUser(null);
            router.push('/auth/login');
          } catch (error) {
            console.error('Error signing out:', error);
          }
        }
      } else if (data.session) {
        // 세션이 있으면 상태 업데이트 (클라이언트-서버 상태 동기화)
        setSession(data.session);
        setUser(data.session.user);
      }
    } catch (error) {
      console.error('세션 확인 중 오류 발생:', error);
    }
  }, [refreshSession, router, user]); // user 의존성 제거

  // 로그아웃 함수
  const signOut = useCallback(
    async (isSessionExpired = false) => {
      try {
        await supabase.auth.signOut();
        // 상태 명시적 업데이트
        setSession(null);
        setUser(null);

        // 세션 만료가 아닌 경우에만 홈으로 리다이렉트
        if (!isSessionExpired) {
          router.push('/');
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Error signing out:', error);
      }
    },
    [router],
  );

  // 관리자 여부 확인 함수
  const isAdmin = useCallback(() => {
    if (!user) return false;
    return ADMIN_EMAILS.includes(user.email || '');
  }, [user]); // user가 변경될 때만 함수 재생성

  // 초기 세션 로드 및 인증 상태 변경 구독
  useEffect(() => {
    // 초기 세션 로드
    fetchSession();

    // 인증 상태 변경 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // 상태 변경 시 즉시 업데이트
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      // 로그인/로그아웃 이벤트 처리
      if (event === 'SIGNED_IN') {
        await fetchSession();
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchSession]);

  // 세션 갱신 및 만료 감지 로직
  useEffect(() => {
    if (!user) return; // 로그인되지 않은 경우 실행하지 않음

    // 세션 갱신 인터벌 설정
    const refreshInterval = setInterval(() => {
      refreshSession();
    }, SESSION_REFRESH_INTERVAL);

    // 세션 유효성 주기적 확인 인터벌
    const checkInterval = setInterval(() => {
      checkSession();
    }, SESSION_CHECK_INTERVAL);

    // 페이지 포커스 시 세션 확인
    const handleFocus = () => {
      checkSession();
    };

    // 네트워크 상태 변경 시 세션 확인
    const handleOnline = () => {
      if (navigator.onLine) {
        checkSession();
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleOnline);

    return () => {
      clearInterval(refreshInterval);
      clearInterval(checkInterval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleOnline);
    };
  }, [user, checkSession, refreshSession]);

  // 자동 로그아웃 타이머
  useEffect(() => {
    if (!user) return; // 로그인되지 않은 경우 실행하지 않음

    let logoutTimer: NodeJS.Timeout;
    const resetTimer = () => {
      // 마지막 활동 시간 업데이트
      lastActivityRef.current = Date.now();

      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(async () => {
        // 실제 비활성 시간 다시 확인 (타이머 실행 시점에)
        const inactiveTime = Date.now() - lastActivityRef.current;
        if (inactiveTime >= INACTIVITY_LOGOUT_TIME) {
          toast.info('장시간 활동이 없어 자동 로그아웃 되었습니다.');
          // signOut 함수 직접 호출 대신 내부 로직 구현
          try {
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            router.push('/');
          } catch (error) {
            console.error('자동 로그아웃 중 오류 발생:', error);
          }
        }
      }, INACTIVITY_LOGOUT_TIME);
    };

    // 사용자 활동 감지 이벤트 핸들러
    const handleUserActivity = () => {
      resetTimer();
    };

    // 페이지 가시성 변경 감지 (탭 전환 등)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // 페이지가 다시 보이면 세션 확인 및 타이머 재설정
        checkSession();
        resetTimer();
      }
    };

    // bfcache 지원을 위한 정리 함수
    const handleBeforeUnload = () => {
      clearTimeout(logoutTimer);
    };

    // 이벤트 위임을 통한 최적화 - 모든 이벤트에 대해 별도 리스너 대신 document에 하나의 리스너 연결
    document.addEventListener('mousemove', handleUserActivity, { passive: true });
    document.addEventListener('keypress', handleUserActivity, { passive: true });
    document.addEventListener('scroll', handleUserActivity, { passive: true });
    document.addEventListener('click', handleUserActivity, { passive: true });
    document.addEventListener('touchstart', handleUserActivity, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 페이지 떠날 때 정리
    window.addEventListener('beforeunload', handleBeforeUnload);

    resetTimer(); // 초기 타이머 설정

    return () => {
      clearTimeout(logoutTimer);
      document.removeEventListener('mousemove', handleUserActivity);
      document.removeEventListener('keypress', handleUserActivity);
      document.removeEventListener('scroll', handleUserActivity);
      document.removeEventListener('click', handleUserActivity);
      document.removeEventListener('touchstart', handleUserActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user, router, checkSession]); // signOut 대신 router 의존성 추가

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

// 커스텀 훅 - 반드시 함수 컴포넌트 내부에서만 사용해야 함
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
