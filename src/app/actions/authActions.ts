'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { extractErrorMessage } from '@/utils/common';
import { isUser } from '@/utils/isUser';

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
    return { success: false, error: validationResult.error.message };
  }

  const { email, password } = formData;

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: extractErrorMessage(error, '로그인 실패') };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: extractErrorMessage(error, '로그인 중 오류가 발생했습니다.') };
  }
}

// 회원가입 서버 액션
export async function signup(formData: SignupFormData) {
  // 유효성 검사
  const validationResult = signupSchema.safeParse(formData);
  if (!validationResult.success) {
    return { success: false, error: validationResult.error.message };
  }

  const { email, password } = formData;

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (error) {
      return { success: false, error: extractErrorMessage(error, '회원가입 실패') };
    }

    return { success: true, message: '이메일 확인을 위한 링크가 발송되었습니다.' };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, '회원가입 중 오류가 발생했습니다.'),
    };
  }
}

// 로그아웃 서버 액션
export async function logout() {
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: extractErrorMessage(error, '로그아웃 실패') };
    }
    redirect('/');
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, '로그아웃 중 오류가 발생했습니다.'),
    };
  }
}

// 현재 로그인한 사용자 정보 가져오기
export async function getCurrentUser() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      return {
        success: false,
        error: extractErrorMessage(error, '유저 정보를 가져오지 못했습니다.'),
      };
    }
    if (!isUser(user)) {
      return { success: false, error: '유저 정보가 유효하지 않습니다.' };
    }
    return user;
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, '유저 정보를 가져오지 못했습니다.'),
    };
  }
}

// 사용자 인증 여부 확인
// 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user || (user && 'success' in user && user.success === false)) {
    redirect('/login');
  }
  return user;
}
