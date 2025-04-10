'use client';

import { login } from '@/app/actions/authActions';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 로그인 폼 검증 스키마
const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await login(data);

      if (result.error) {
        setError(result.error);
      } else {
        // 로그인 성공 시 홈페이지로 이동
        router.push('/');
        router.refresh();
      }
    } catch {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
          이메일
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          placeholder="이메일 주소"
          disabled={isLoading}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          placeholder="비밀번호"
          disabled={isLoading}
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </div>
    </form>
  );
}
