'use client';

import { login } from '@/app/actions/authActions';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// 로그인 폼 검증 스키마
const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { fetchSession } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: userData, error: loginError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (loginError) {
        throw new Error(loginError.message || '로그인에 실패했습니다.');
      }

      if (userData?.user) {
        // 세션 정보 업데이트
        await fetchSession();

        // 홈 페이지로 리다이렉트
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      setError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-[#e9dfd5] bg-[#fdf6ed] p-8 shadow-md">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-[#3d2c29]">로그인</h2>
        <p className="mt-2 text-sm text-[#5f4b45]">
          계정이 없으신가요?{' '}
          <a
            href="/auth/signup"
            className="font-medium text-[#e67e22] hover:text-[#d35400] transition-colors"
          >
            회원가입
          </a>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        {error && <div className="rounded-md bg-red-50 p-4 text-sm text-[#e74c3c]">{error}</div>}

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#3d2c29]">
              이메일
            </label>
            <div className="mt-1">
              <input
                id="email"
                type="email"
                {...register('email')}
                className="block w-full rounded-[0.8rem] border border-[#e9dfd5] bg-[#fffaf5] px-4 py-2 text-[#3d2c29] shadow-sm transition-all focus:border-[#e67e22] focus:outline-none focus:ring-2 focus:ring-[rgba(230,126,34,0.4)]"
                placeholder="이메일 주소"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-[#e74c3c]">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#3d2c29]">
              비밀번호
            </label>
            <div className="mt-1">
              <input
                id="password"
                type="password"
                {...register('password')}
                className="block w-full rounded-[0.8rem] border border-[#e9dfd5] bg-[#fffaf5] px-4 py-2 text-[#3d2c29] shadow-sm transition-all focus:border-[#e67e22] focus:outline-none focus:ring-2 focus:ring-[rgba(230,126,34,0.4)]"
                placeholder="비밀번호"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-[#e74c3c]">{errors.password.message}</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-[0.8rem] border border-transparent bg-[#e67e22] px-4 py-3 text-[1.6rem] font-medium text-white transition-all hover:bg-[#d35400] focus:outline-none focus:ring-2 focus:ring-[rgba(230,126,34,0.4)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="mr-2 h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                로그인 중...
              </span>
            ) : (
              '로그인'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
