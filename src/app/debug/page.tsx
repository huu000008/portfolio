'use client';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';

export default function DebugPage() {
  const { user, session, isLoading } = useAuth();
  const [browserSession, setBrowserSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 직접 supabase 클라이언트를 사용해 세션 조회
  useEffect(() => {
    async function getSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setError(error.message);
          return;
        }
        setBrowserSession(data.session);
      } catch (err) {
        setError('세션 조회 중 오류 발생');
        console.error(err);
      }
    }

    getSession();
  }, []);

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
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify({ browserSession }, null, 2)}
          </pre>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">쿠키 정보</h2>
        <pre className="bg-gray-100 p-4 rounded">{document.cookie || '쿠키 없음'}</pre>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">인증 테스트 액션</h2>
        <div className="flex space-x-4">
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
