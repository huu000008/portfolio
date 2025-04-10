'use client';

import { signup } from '@/app/actions/authActions';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 회원가입 폼 검증 스키마
const signupSchema = z
  .object({
    email: z.string().email('유효한 이메일을 입력해주세요.'),
    password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
    confirmPassword: z.string().min(6, '비밀번호 확인은 최소 6자 이상이어야 합니다.'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await signup(data);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccessMessage(result.message || '회원가입이 완료되었습니다. 이메일을 확인해주세요.');
        // 성공 메시지 표시 후 3초 후에 로그인 페이지로 이동
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      }
    } catch {
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      {successMessage && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">{successMessage}</div>
      )}

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
          placeholder="비밀번호 (최소 6자)"
          disabled={isLoading}
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">
          비밀번호 확인
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          placeholder="비밀번호 확인"
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? '가입 중...' : '회원가입'}
        </button>
      </div>
    </form>
  );
}
