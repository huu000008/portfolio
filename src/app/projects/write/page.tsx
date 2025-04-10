import { ProjectForm } from '@/features/projects/components/ProjectForm';
import { ProjectHeader } from '@/features/projects/components/ProjectHeader';
import { requireAuth } from '@/app/actions/authActions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '프로젝트 작성 | 포트폴리오',
  description: '새 프로젝트를 작성합니다.',
};

export default async function WritePage() {
  // 인증된 사용자만 접근 가능
  await requireAuth();

  return (
    <>
      <ProjectHeader />
      <ProjectForm />
    </>
  );
}
