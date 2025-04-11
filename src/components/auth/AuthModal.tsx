'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
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

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;
type AuthMode = 'login' | 'signup';

interface AuthModalProps {
  trigger: React.ReactNode;
  initialMode?: AuthMode;
}

export default function AuthModal({ trigger, initialMode = 'login' }: AuthModalProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const router = useRouter();
  const { fetchSession } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0); // 폼 강제 리렌더링을 위한 키

  // 로그인 폼 설정
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // 회원가입 폼 설정
  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: signupErrors },
    reset: resetSignup,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  // 모든 상태 초기화 함수
  const resetAllStates = () => {
    setError(null);
    setSuccessMessage(null);
    resetLogin();
    resetSignup();
    setFormKey(prev => prev + 1); // 폼 키를 변경하여 강제 리렌더링
    setMode(initialMode);
  };

  // 모달 상태 변경 핸들러
  const handleOpenChange = (newOpen: boolean) => {
    // 로딩 중에는 모달을 닫지 못하도록 방지
    if (isLoading && !newOpen) {
      return;
    }

    setOpen(newOpen);
    // 모달이 닫힐 때 모든 상태 초기화
    if (!newOpen) {
      resetAllStates();
    }
  };

  // 모드 전환 함수
  const toggleMode = () => {
    setError(null);
    setSuccessMessage(null);

    // 폼 상태 초기화 - 강제 리렌더링
    resetLogin();
    resetSignup();
    setFormKey(prev => prev + 1);

    setMode(prev => (prev === 'login' ? 'signup' : 'login'));
  };

  // 로그인 처리
  const onLoginSubmit = async (data: LoginFormData) => {
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
        resetLogin();

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

  // 회원가입 처리
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

      if (signupError) {
        throw new Error(signupError.message || '회원가입에 실패했습니다.');
      }

      if (userData?.user) {
        setSuccessMessage('이메일로 발송된 확인 링크를 클릭하여 가입을 완료해주세요.');

        // 3초 후에 로그인 모드로 전환
        setTimeout(() => {
          setMode('login');
          setSuccessMessage(null);
          resetSignup();
        }, 3000);
      }
    } catch (err) {
      console.error('회원가입 오류:', err);
      setError(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <div className={styles.modalContainer}>
            <Dialog.Title className={styles.title}>
              {mode === 'login' ? '로그인' : '회원가입'}
            </Dialog.Title>
            <Dialog.Description className={styles.description}>
              {mode === 'login'
                ? '계정에 로그인하여 서비스를 이용하세요.'
                : '회원가입을 통해 서비스를 이용해보세요.'}
            </Dialog.Description>

            {/* formKey를 키로 사용하여 모드 전환 시 컴포넌트를 완전히 새로 마운트 */}
            <div key={formKey}>
              {mode === 'login' ? (
                <form onSubmit={handleSubmitLogin(onLoginSubmit)} className={styles.form}>
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
                          {...registerLogin('email')}
                          className={styles.input}
                          placeholder="이메일 주소"
                          disabled={isLoading}
                        />
                        {loginErrors.email && (
                          <p className={styles.errorMessage}>{loginErrors.email.message}</p>
                        )}
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
                          {...registerLogin('password')}
                          className={styles.input}
                          placeholder="비밀번호"
                          disabled={isLoading}
                        />
                        {loginErrors.password && (
                          <p className={styles.errorMessage}>{loginErrors.password.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.actionRow}>
                    <button type="button" onClick={toggleMode} className={styles.signupLink}>
                      계정이 없으신가요?
                    </button>
                  </div>

                  <div className={styles.buttonGroup}>
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
              ) : (
                <form onSubmit={handleSubmitSignup(onSignupSubmit)} className={styles.form}>
                  {error && <div className={styles.error}>{error}</div>}
                  {successMessage && <div className={styles.success}>{successMessage}</div>}

                  <div className={styles.formGroup}>
                    <div className={styles.formField}>
                      <label htmlFor="signup-email" className={styles.label}>
                        이메일
                      </label>
                      <div className={styles.inputWrapper}>
                        <input
                          id="signup-email"
                          type="email"
                          {...registerSignup('email')}
                          className={styles.input}
                          placeholder="이메일 주소"
                          disabled={isLoading}
                        />
                        {signupErrors.email && (
                          <p className={styles.errorMessage}>{signupErrors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className={styles.formField}>
                      <label htmlFor="signup-password" className={styles.label}>
                        비밀번호
                      </label>
                      <div className={styles.inputWrapper}>
                        <input
                          id="signup-password"
                          type="password"
                          {...registerSignup('password')}
                          className={styles.input}
                          placeholder="비밀번호 (최소 6자)"
                          disabled={isLoading}
                        />
                        {signupErrors.password && (
                          <p className={styles.errorMessage}>{signupErrors.password.message}</p>
                        )}
                      </div>
                    </div>

                    <div className={styles.formField}>
                      <label htmlFor="signup-confirm-password" className={styles.label}>
                        비밀번호 확인
                      </label>
                      <div className={styles.inputWrapper}>
                        <input
                          id="signup-confirm-password"
                          type="password"
                          {...registerSignup('confirmPassword')}
                          className={styles.input}
                          placeholder="비밀번호 확인"
                          disabled={isLoading}
                        />
                        {signupErrors.confirmPassword && (
                          <p className={styles.errorMessage}>
                            {signupErrors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.actionRow}>
                    <button type="button" onClick={toggleMode} className={styles.signupLink}>
                      이미 계정이 있으신가요?
                    </button>
                  </div>

                  <div className={styles.buttonGroup}>
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
                          가입 중...
                        </span>
                      ) : (
                        '회원가입'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {!isLoading && (
            <Dialog.Close asChild>
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
            </Dialog.Close>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
