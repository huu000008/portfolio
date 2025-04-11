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

export const ImageUploader = ({ name, id }: Props) => {
  const { setValue, watch, getValues } = useFormContext();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // 초기값 제거
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const watchedUrl = watch(name);
    const fallback = getValues(name); // <- 초기 값

    if (watchedUrl) {
      setPreviewUrl(watchedUrl);
    } else if (fallback) {
      setPreviewUrl(fallback);
    }
  }, [name, watch, getValues]);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const safeFileName = sanitizeFileName(file.name);
    const filePath = `${Date.now()}_${safeFileName}`;

    // console.log('🔍 선택한 파일:', file);
    // console.log('📂 업로드 경로:', filePath);

    setUploading(true);

    try {
      const { error } = await supabase.storage.from('project-images').upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

      if (error) {
        console.error('❌ 업로드 실패:', error.message);
        alert(`업로드 실패: ${error.message}`);
        setUploading(false);
        return;
      }

      // 비동기 처리를 위해 await 추가
      const { data } = await supabase.storage.from('project-images').getPublicUrl(filePath);

      // console.log('✅ 업로드 성공:', data.publicUrl);

      setValue(name, data.publicUrl);
      setPreviewUrl(data.publicUrl);
    } catch (err) {
      console.error('❌ 예상치 못한 오류:', err);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      {previewUrl ? (
        <div className={styles.preview}>
          <Image src={previewUrl} alt="업로드된 이미지 미리보기" width={300} height={200} />
          <button
            type="button"
            className={styles.remove}
            onClick={() => {
              setValue(name, '');
              setPreviewUrl(null);
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
            <small>권장 크기: 1200 x 800px</small>
          </label>
          <input type="file" id={id} accept="image/*" onChange={handleChange} />
        </div>
      )}
      {uploading && <p className={styles.uploading}>업로드 중...</p>}
    </div>
  );
};
