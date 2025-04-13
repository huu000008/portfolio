'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import styles from './ImageUploader.module.scss';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';

interface Props {
  name: string;
  id?: string;
}

const sanitizeFileName = (filename: string) =>
  filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_');

// Supabase 응답 타입 정의
interface SupabaseUploadResponse {
  data: {
    path?: string;
  } | null;
  error: {
    message: string;
  } | null;
}

// Supabase 연결 상태 확인 함수
const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // healthcheck 테이블이 없으므로 대신 다른 기본 쿼리 사용
    const { error } = await supabase.from('projects').select('count').limit(1).single();
    return !error;
  } catch (e) {
    console.error('Supabase 연결 확인 오류:', e);
    return false;
  }
};

export const ImageUploader = ({ name, id }: Props) => {
  const { setValue, watch, getValues } = useFormContext();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // 초기값 제거
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const [autoRetry, setAutoRetry] = useState(false);
  const [cachedFile, setCachedFile] = useState<File | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    'checking' | 'connected' | 'disconnected'
  >('checking');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const watchedUrl = watch(name);
    const fallback = getValues(name); // <- 초기 값

    if (watchedUrl) {
      setPreviewUrl(watchedUrl);
    } else if (fallback) {
      setPreviewUrl(fallback);
    }
  }, [name, watch, getValues]);

  // 자동 재시도 hook
  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;

    if (autoRetry && error && retryCount < MAX_RETRIES) {
      retryTimeout = setTimeout(() => {
        console.log(`자동 재시도 중... (${retryCount + 1}/${MAX_RETRIES})`);
        handleRetry();
        setAutoRetry(false);
      }, 3000); // 3초 후 재시도
    }

    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [autoRetry, error, retryCount]);

  // 클라이언트 사이드에서만 실행되는 코드 처리
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 네트워크 상태 감시 - 클라이언트 사이드에서만 실행
  useEffect(() => {
    if (!isClient) return;

    const handleOnline = () => {
      console.log('네트워크 연결 복구됨');
      if (error && cachedFile) {
        console.log('네트워크 연결 복구 후 자동 재시도');
        setAutoRetry(true);
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [error, cachedFile, isClient]);

  // Supabase 연결 상태 확인
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await checkSupabaseConnection();
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
    };

    checkConnection();

    // 30초마다 연결 상태 체크
    const intervalId = setInterval(checkConnection, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const handleRetry = () => {
    setError(null);
    setUploadProgress(0);

    // 파일 다시 선택하도록 안내
    if (retryCount >= MAX_RETRIES) {
      alert('여러 번 시도했지만 업로드에 실패했습니다. 페이지를 새로고침한 후 다시 시도해 주세요.');
      return;
    }

    // 재시도 카운트 증가
    setRetryCount(prev => prev + 1);

    // 마지막으로 선택한 파일 정보가 있으면 자동으로 업로드 재시도
    const fileInput = document.getElementById(id as string) as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const changeEvent = new Event('change', { bubbles: true });
      fileInput.dispatchEvent(changeEvent);
    }
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 캐시 파일 저장
    setCachedFile(file);

    // 네트워크 연결 상태 확인 (클라이언트 사이드에서만)
    if (isClient && !navigator.onLine) {
      setError('인터넷 연결이 끊어졌습니다. 연결 상태를 확인한 후 다시 시도해 주세요.');
      return;
    }

    // 초기화
    setError(null);
    setUploadProgress(0);

    // 자동 재시도인 경우가 아니면 재시도 카운트 초기화
    if (!autoRetry) {
      setRetryCount(0);
    }

    // 파일 크기 제한 (예: 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setError('파일 크기가 너무 큽니다. 10MB 이하의 이미지를 업로드해주세요.');
      return; // alert 제거 - hydration 문제 피하기 위해
    }

    // 파일 타입 검사
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return; // alert 제거 - hydration 문제 피하기 위해
    }

    const safeFileName = sanitizeFileName(file.name);
    const filePath = `${Date.now()}_${safeFileName}`;

    console.log('🔍 선택한 파일:', file.name, file.size, file.type);
    console.log('🔗 업로드 경로:', filePath);

    setUploading(true);

    // 네트워크 타임아웃 설정
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('업로드 시간이 초과되었습니다.')), 30000); // 30초 타임아웃
    });

    try {
      console.log('업로드 시작...');
      const uploadStart = Date.now();

      // 실제 업로드 진행 상태 갱신 (0%에서 시작)
      setUploadProgress(0);

      // 진행 상태 시뮬레이션 - 더 자연스러운 진행 속도로 변경
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          // 0% -> 85%까지 단계적으로 증가 (실제 업로드 완료 전까지)
          if (prev < 85) {
            const increment = Math.max(1, Math.floor((85 - prev) / 10));
            return prev + increment;
          }
          return prev;
        });
      }, 300);

      try {
        // Promise.race를 사용하여 타임아웃 처리
        const uploadResult = (await Promise.race([
          supabase.storage.from('project-images').upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
          }),
          timeoutPromise,
        ])) as SupabaseUploadResponse | Error;

        // 타임아웃 에러 체크
        if (uploadResult instanceof Error) {
          throw uploadResult;
        }

        const { data: uploadData, error } = uploadResult;

        console.log('업로드 응답 시간:', Date.now() - uploadStart, 'ms');
        console.log('업로드 응답 데이터:', uploadData);

        if (error) {
          console.error('❌ 업로드 실패:', error.message);

          // 파일 크기 제한 에러 구체적으로 처리
          if (error.message.includes('size')) {
            setError('파일 크기가 너무 큽니다. Supabase의 제한을 초과했습니다.');
          }
          // 권한 에러 처리
          else if (error.message.includes('permission') || error.message.includes('authorized')) {
            setError('업로드 권한이 없습니다. 로그인 상태를 확인해주세요.');
          }
          // CORS 에러 처리
          else if (error.message.includes('CORS')) {
            setError('CORS 정책 오류가 발생했습니다. 관리자에게 문의하세요.');
          }
          // 기타 오류
          else {
            setError(`업로드 실패: ${error.message}`);
          }

          // 자동 재시도 활성화
          setAutoRetry(true);

          setUploading(false);
          clearInterval(progressInterval);
          return;
        }

        // 85% -> 95% 업데이트 (URL 가져오기 진행 중)
        setUploadProgress(95);

        console.log('URL 가져오기 시작...');
        const urlStart = Date.now();

        // 비동기 처리를 위해 await 추가
        const { data } = await supabase.storage.from('project-images').getPublicUrl(filePath);

        console.log('URL 가져오기 응답 시간:', Date.now() - urlStart, 'ms');
        console.log('✅ 업로드 성공:', data.publicUrl);

        // 100% 완료 표시
        setUploadProgress(100);

        // 완료 후 잠시 진행 표시 유지 후 업로드 상태 초기화
        setTimeout(() => {
          setValue(name, data.publicUrl);
          setPreviewUrl(data.publicUrl);
          setUploading(false);
          setCachedFile(null); // 캐시 파일 초기화
          setRetryCount(0); // 재시도 카운트 초기화
        }, 500);
      } catch (err) {
        clearInterval(progressInterval);

        if (err instanceof Error) {
          console.error('❌ 예상치 못한 오류:', err.message);

          // 타임아웃 오류 처리
          if (err.message.includes('시간이 초과')) {
            setError(
              '업로드 시간이 초과되었습니다. 네트워크 연결을 확인하거나 나중에 다시 시도해주세요.',
            );
          } else {
            setError(err.message);
          }
        } else {
          console.error('❌ 예상치 못한 오류:', err);
          setError('이미지 업로드 중 오류가 발생했습니다.');
        }

        // 자동 재시도 활성화
        setAutoRetry(true);
      }
    } catch (err) {
      console.error('❌ 전체 프로세스 오류:', err);
      setError(err instanceof Error ? err.message : '이미지 업로드 중 오류가 발생했습니다.');

      // 자동 재시도 활성화
      setAutoRetry(true);
    } finally {
      // 업로딩 상태는 이제 각 분기에서 개별적으로 처리
      setUploadProgress(0);
    }
  };

  // 파일 입력 요소 참조
  const fileInputRef = (input: HTMLInputElement | null) => {
    // 클라이언트 사이드에서만 실행
    if (!isClient || !input || !autoRetry || !cachedFile) return;

    try {
      // 캐시된 파일 존재 시 DataTransfer 객체 생성
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(cachedFile);

      // 파일 목록 설정
      input.files = dataTransfer.files;

      // 변경 이벤트 발생
      const event = new Event('change', { bubbles: true });
      setTimeout(() => input.dispatchEvent(event), 0);
    } catch (error) {
      console.error('파일 자동 선택 중 오류:', error);
      // 실패 시 자동 재시도 비활성화
      setAutoRetry(false);
    }
  };

  // 디버그 모드 토글
  const toggleDebugMode = () => {
    setDebugMode(prev => !prev);
  };

  return (
    <div className={styles.wrap}>
      {previewUrl ? (
        <div className={styles.preview}>
          <Image
            src={previewUrl}
            alt="업로드된 이미지 미리보기"
            width={300}
            height={200}
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
          <button
            type="button"
            className={styles.remove}
            onClick={() => {
              setValue(name, '');
              setPreviewUrl(null);
              setError(null);
              setUploadProgress(0);
            }}
            aria-label="이미지 삭제"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className={styles.upload}>
          <label htmlFor={id}>
            <div className={styles.icon}>📁</div>
            <p>이미지를 선택하거나 여기에 드래그하세요</p>
            <small>권장 크기: 1200 x 800px (최대 10MB)</small>
          </label>
          <input type="file" id={id} accept="image/*" onChange={handleChange} ref={fileInputRef} />
        </div>
      )}
      {uploading && (
        <div>
          <p className={styles.uploading}>업로드 중... {uploadProgress}%</p>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${uploadProgress}%` }}></div>
            </div>
          )}
        </div>
      )}
      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.error}>{error}</p>
          <div className={styles.retryActions}>
            {autoRetry && retryCount < MAX_RETRIES ? (
              <p className={styles.autoRetry}>
                {retryCount + 1}/{MAX_RETRIES} 자동 재시도 중...
              </p>
            ) : (
              retryCount < MAX_RETRIES && (
                <button type="button" className={styles.retryButton} onClick={handleRetry}>
                  다시 시도
                </button>
              )
            )}
            {retryCount >= MAX_RETRIES && (
              <button
                type="button"
                className={styles.refreshButton}
                onClick={() => window.location.reload()}
              >
                페이지 새로고침
              </button>
            )}
          </div>
        </div>
      )}

      {/* 디버그 버튼 (숨겨진 기능) */}
      {isClient && debugMode && (
        <div className={styles.debugContainer}>
          <div className={styles.debugHeader}>
            <h4>디버그 정보</h4>
            <span className={styles.connectionStatus}>
              Supabase:{' '}
              {connectionStatus === 'checking'
                ? '확인 중...'
                : connectionStatus === 'connected'
                  ? '연결됨 ✅'
                  : '연결 안됨 ❌'}
            </span>
          </div>
          <div className={styles.debugInfo}>
            <p>네트워크 상태: {isClient && navigator.onLine ? '온라인' : '오프라인'}</p>
            <p>
              재시도 횟수: {retryCount}/{MAX_RETRIES}
            </p>
            <p>자동 재시도: {autoRetry ? '활성화' : '비활성화'}</p>
            <p>캐시된 파일: {cachedFile ? cachedFile.name : '없음'}</p>
            <button
              type="button"
              className={styles.debugButton}
              onClick={() => {
                console.log('Supabase 연결 재설정');
                // Supabase 클라이언트 상태 리셋을 위한 더미 요청
                supabase.auth.refreshSession();
              }}
            >
              Supabase 연결 재설정
            </button>
          </div>
        </div>
      )}

      {/* 디버그 모드 토글은 클라이언트에서만 표시 */}
      {isClient && (
        <div className={styles.debugToggle} onClick={toggleDebugMode} title="디버그 모드" />
      )}
    </div>
  );
};
