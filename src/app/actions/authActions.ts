'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// 로그인 유효성 검사 스키마
const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// 회원가입 유효성 검사 스키마
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

/**
 * 로그인 서버 액션
 */
export async function login(formData: LoginFormData) {
  // 유효성 검사
  const validationResult = loginSchema.safeParse(formData);
  if (!validationResult.success) {
    return { error: validationResult.error.message };
  }

  const { email, password } = formData;

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch {
    return { error: '로그인 중 오류가 발생했습니다.' };
  }
}

// 회원가입 서버 액션
export async function signup(formData: SignupFormData) {
  // 유효성 검사
  const validationResult = signupSchema.safeParse(formData);
  if (!validationResult.success) {
    return { error: validationResult.error.message };
  }

  const { email, password } = formData;

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true, message: '이메일 확인을 위한 링크가 발송되었습니다.' };
  } catch {
    return { error: '회원가입 중 오류가 발생했습니다.' };
  }
}

// 로그아웃 서버 액션
export async function logout() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect('/');
}

// 현재 로그인한 사용자 정보 가져오기
export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// 사용자 인증 여부 확인
// 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }
  return user;
}
