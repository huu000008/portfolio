'use client';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { useEffect, useState, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

export default function DebugPage() {
  const { user, session, isLoading, fetchSession } = useAuth();
  const [browserSession, setBrowserSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cookies, setCookies] = useState<string>('쿠키 정보를 가져오는 중...');
  const [sessionExpiry, setSessionExpiry] = useState<string>('');

  // 세션 정보 조회 함수
  const getSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setError(error.message);
        return;
      }
      setBrowserSession(data.session);

      // 세션 만료 시간 계산
      if (data.session?.expires_at) {
        const expiryDate = new Date(data.session.expires_at * 1000);
        setSessionExpiry(expiryDate.toLocaleString());
      } else {
        setSessionExpiry('세션 만료 정보 없음');
      }
    } catch (err) {
      setError('세션 조회 중 오류 발생');
      console.error(err);
    }
  }, []);

  // 세션 갱신 함수
  const refreshSessionManually = useCallback(async () => {
    try {
      const { error } = await supabase.auth.refreshSession();
      if (error) {
        toast.error('세션 갱신 실패: ' + error.message);
        return;
      }

      toast.success('세션이 성공적으로 갱신되었습니다.');
      await getSession(); // 갱신된 세션 정보 다시 조회
      await fetchSession(); // AuthContext 세션 정보도 갱신
    } catch (err) {
      toast.error('세션 갱신 중 오류 발생');
      console.error(err);
    }
  }, [getSession, fetchSession]);

  // 초기 로드 시 세션 정보 조회
  useEffect(() => {
    getSession();

    // 브라우저에서만 쿠키에 접근
    setCookies(document.cookie || '쿠키 없음');

    // 주기적으로 세션 정보 갱신 (디버깅 목적)
    const interval = setInterval(() => {
      getSession();
    }, 30000); // 30초마다 갱신

    return () => clearInterval(interval);
  }, [getSession]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">인증 디버깅 페이지</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">로딩 상태</h2>
        <pre className="bg-gray-100 p-4 rounded">{JSON.stringify({ isLoading }, null, 2)}</pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Context에서 가져온 인증 상태</h2>
        <pre className="bg-gray-100 p-4 rounded">{JSON.stringify({ user, session }, null, 2)}</pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">직접 Supabase 호출 결과</h2>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <pre className="bg-gray-100 p-4 rounded mb-2">
              {JSON.stringify({ browserSession }, null, 2)}
            </pre>
            <div className="bg-yellow-100 p-4 rounded">
              <p className="font-semibold">세션 만료 시간: {sessionExpiry}</p>
              {browserSession && (
                <p>
                  현재 시간: {new Date().toLocaleString()} (만료까지
                  {browserSession.expires_at
                    ? Math.round((browserSession.expires_at * 1000 - Date.now()) / 60000)
                    : '알 수 없는'}{' '}
                  분 남음)
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">쿠키 정보</h2>
        <pre className="bg-gray-100 p-4 rounded">{cookies}</pre>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">인증 테스트 액션</h2>
        <div className="flex space-x-4">
          <button
            onClick={refreshSessionManually}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            세션 수동 갱신
          </button>

          <button
            onClick={getSession}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            세션 정보 새로고침
          </button>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.reload();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
