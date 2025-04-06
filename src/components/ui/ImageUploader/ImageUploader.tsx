'use client';

import { ChangeEvent, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { supabase } from '@/lib/supabase/client';
import styles from './ImageUploader.module.scss';

interface Props {
  name: string;
}

const sanitizeFileName = (filename: string) =>
  filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_');

export const ImageUploader = ({ name }: Props) => {
  const { setValue, watch } = useFormContext();
  const [previewUrl, setPreviewUrl] = useState<string | null>(watch(name) || null);
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const safeFileName = sanitizeFileName(file.name);
    const filePath = `${Date.now()}_${safeFileName}`;

    console.log('🔍 선택한 파일:', file);
    console.log('📂 업로드 경로:', filePath);

    setUploading(true);

    const { error } = await supabase.storage.from('project-images').upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (error) {
      console.error('❌ 업로드 실패:', error.message);
      alert('업로드 실패');
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('project-images').getPublicUrl(filePath);

    console.log('✅ 업로드 성공:', data.publicUrl);

    setValue(name, data.publicUrl);
    setPreviewUrl(data.publicUrl);
    setUploading(false);
  };

  return (
    <div className={styles.wrap}>
      <input type="file" accept="image/*" onChange={handleChange} />
      {uploading && <p>업로드 중...</p>}
      {previewUrl && (
        <img src={previewUrl} alt="업로드된 이미지 미리보기" className={styles.preview} />
      )}
    </div>
  );
};
