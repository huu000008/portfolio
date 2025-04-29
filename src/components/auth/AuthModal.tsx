'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  loginSchema,
  signupSchema,
  type LoginFormData,
  type SignupFormData,
} from '@/lib/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import ResetPasswordForm from './ResetPasswordForm';
import { Button } from '@/components/ui/button';
import { extractErrorMessage } from '@/utils/common';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type AuthMode = 'login' | 'signup' | 'reset';

interface AuthModalProps {
  open?: boolean;
  onClose?: () => void;
  initialMode?: AuthMode;
}

export default function AuthModal({
  open: openProp = true,
  onClose,
  initialMode = 'login',
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const router = useRouter();
  const { fetchSession } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [open, setOpen] = useState(openProp);

  // 로그인 폼 설정
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 회원가입 폼 설정
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const resetAllStates = () => {
    setError(null);
    setSuccessMessage(null);
    loginForm.reset();
    signupForm.reset();
    setMode(initialMode);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (isLoading && !newOpen) return;
    if (!newOpen) {
      if (onClose) onClose();
      setOpen(false);
      router.back();
      resetAllStates();
    } else {
      setOpen(true);
    }
  };

  const handleAuthError = (err: unknown) => {
    console.error(`${mode === 'login' ? '로그인' : '회원가입'} 오류:`, err);
    setError(
      extractErrorMessage(
        err,
        `${mode === 'login' ? '로그인' : '회원가입'} 중 오류가 발생했습니다.`,
      ),
    );
  };

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: userData, error: loginError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (loginError) {
        if (loginError.status === 400) {
          throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
        throw new Error('로그인 중 오류가 발생했습니다.');
      }
      if (userData?.user) {
        await fetchSession();
        if (onClose) {
          onClose();
        } else {
          setOpen(false);
        }
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignupSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data: userData, error: signupError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signupError) throw new Error(signupError.message);
      if (userData?.user) {
        setSuccessMessage('이메일로 발송된 확인 링크를 클릭하여 가입을 완료해주세요.');
        setTimeout(() => {
          setMode('login');
          setSuccessMessage(null);
          signupForm.reset();
        }, 3000);
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    setResetLoading(true);
    setResetError(null);
    setResetSuccess(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw new Error(error.message);
      setResetSuccess('비밀번호 재설정 메일을 발송했습니다. 메일을 확인해주세요.');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setResetError(err.message);
      } else {
        setResetError('비밀번호 재설정 중 오류가 발생했습니다.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-card p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full">
          <div className="grid gap-4">
            <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground">
              {mode === 'login' ? '로그인' : mode === 'signup' ? '회원가입' : '비밀번호 재설정'}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {mode === 'login'
                ? '계정에 로그인하여 서비스를 이용하세요.'
                : mode === 'signup'
                  ? '회원가입을 통해 서비스를 이용해보세요.'
                  : '비밀번호를 재설정하세요.'}
            </DialogDescription>

            {error && <div className="text-sm font-medium text-destructive">{error}</div>}
            {successMessage && (
              <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {successMessage}
              </div>
            )}
            {resetSuccess && (
              <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {resetSuccess}
              </div>
            )}
            {resetError && <div className="text-sm font-medium text-destructive">{resetError}</div>}

            {mode === 'login' && (
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="grid gap-4">
                  <div className="grid gap-2">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>이메일</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="이메일 주소"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>비밀번호</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="비밀번호"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="h-4 w-4 animate-spin"
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
                  </Button>
                </form>
              </Form>
            )}
            {mode === 'signup' && (
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="grid gap-4">
                  <div className="grid gap-2">
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>이메일</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="이메일 주소"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>비밀번호</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="비밀번호"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>비밀번호 확인</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="비밀번호 확인"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="h-4 w-4 animate-spin"
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
                        가입 중...
                      </span>
                    ) : (
                      '회원가입'
                    )}
                  </Button>
                </form>
              </Form>
            )}
            {mode === 'reset' && (
              <ResetPasswordForm onSubmit={handleResetPassword} loading={resetLoading} />
            )}
            <div className="flex justify-between">
              {mode !== 'login' && (
                <Button
                  type="button"
                  onClick={() => setMode('login')}
                  variant="link"
                  className="px-0 text-primary"
                >
                  로그인으로 돌아가기
                </Button>
              )}
              {mode !== 'signup' && (
                <Button
                  type="button"
                  onClick={() => setMode('signup')}
                  variant="link"
                  className="px-0 text-primary"
                >
                  회원가입
                </Button>
              )}
              {mode !== 'reset' && (
                <Button
                  type="button"
                  onClick={() => setMode('reset')}
                  variant="link"
                  className="px-0 text-primary"
                >
                  비밀번호 재설정
                </Button>
              )}
            </div>
          </div>

          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
            >
              <path
                d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                fill="currentColor"
              />
            </svg>
            <span className="sr-only">닫기</span>
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
