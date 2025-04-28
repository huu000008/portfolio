'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import styles from './LoginModal.module.scss';

// 로그인 폼 검증 스키마
const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginModalProps {
  trigger: React.ReactNode;
}

export default function LoginModal({ trigger }: LoginModalProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { fetchSession } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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

        // 모달 닫기 및 폼 초기화
        setOpen(false);
        reset();

        // 페이지 새로고침
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className={styles.overlay} />
        <DialogContent className={styles.content}>
          <div className={styles.modalContainer}>
            <DialogTitle className={styles.title}>로그인</DialogTitle>
            <DialogDescription className={styles.description}>
              계정에 로그인하여 서비스를 이용하세요.
            </DialogDescription>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              {error && <div className={styles.error}>{error}</div>}
              <div className={styles.formGroup}>
                <div className={styles.formField}>
                  <label htmlFor="email" className={styles.label}>
                    이메일
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      className={styles.input}
                      placeholder="이메일 주소"
                      disabled={isLoading}
                    />
                    {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}
                  </div>
                </div>
                <div className={styles.formField}>
                  <label htmlFor="password" className={styles.label}>
                    비밀번호
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="password"
                      type="password"
                      {...register('password')}
                      className={styles.input}
                      placeholder="비밀번호"
                      disabled={isLoading}
                    />
                    {errors.password && (
                      <p className={styles.errorMessage}>{errors.password.message}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.actionRow}>
                <div>
                  <a href="/auth/signup" className={styles.signupLink}>
                    계정이 없으신가요?
                  </a>
                </div>
              </div>
              <div>
                <button type="submit" disabled={isLoading} className={styles.submitButton}>
                  {isLoading ? (
                    <span className={styles.loadingWrapper}>
                      <svg
                        className={styles.loadingIcon}
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
          <DialogClose asChild>
            <button className={styles.closeButton} aria-label="닫기">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
