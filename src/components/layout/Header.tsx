'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Header() {
  const { user, signOut, isLoading } = useAuth();

  // 디버깅용 코드
  useEffect(() => {
    console.log('Auth 상태 (Header):', { user, isLoading });
  }, [user, isLoading]);

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          포트폴리오
        </Link>

        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/projects" className="text-gray-600 hover:text-gray-900">
                프로젝트
              </Link>
            </li>
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <li>
                      <Link href="/projects/write" className="text-gray-600 hover:text-gray-900">
                        글 작성
                      </Link>
                    </li>
                    <li>
                      <button onClick={signOut} className="text-gray-600 hover:text-gray-900">
                        로그아웃 ({user.email})
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
                        로그인
                      </Link>
                    </li>
                    <li>
                      <Link href="/auth/signup" className="text-gray-600 hover:text-gray-900">
                        회원가입
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
