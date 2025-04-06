'use client';

import { TransitionLink } from '@/components/TransitionLink';
import styles from './ProjectHeader.module.scss';
import { useRouter, usePathname } from 'next/navigation';
import { deleteProject } from '@/features/projects/api/deleteProject';
import { useToast } from '@/hooks/useToast';

interface ProjectHeaderProps {
  id?: string;
}

export const ProjectHeader = ({ id }: ProjectHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { success, error } = useToast();

  const isEditPage = pathname.startsWith('/projects/edit');
  const isListPage = pathname === '/projects';
  const isDetailPage = pathname.startsWith('/projects/') && !isEditPage;

  const handleDelete = async () => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;

    if (!id) {
      error('프로젝트 ID가 없습니다', {
        title: '오류',
        duration: 5000,
      });
      return;
    }

    try {
      await deleteProject(id);
      success('프로젝트가 성공적으로 삭제되었습니다', {
        title: '삭제 완료',
        duration: 3000,
      });
      router.push('/projects');
    } catch (err) {
      error(
        '삭제 실패: ' + (err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다'),
        {
          title: '오류',
          duration: 5000,
        },
      );
    }
  };

  return (
    <div className={styles.wrap}>
      <h2>Projects</h2>
      <div className={styles.actions}>
        {!isListPage && <TransitionLink href="/projects">목록</TransitionLink>}

        {isListPage && <TransitionLink href="/projects/write">작성</TransitionLink>}

        {isDetailPage && id && (
          <>
            <TransitionLink href={`/projects/edit/${id}`}>수정</TransitionLink>
            <button onClick={handleDelete}>삭제</button>
          </>
        )}

        {isEditPage && id && <button onClick={handleDelete}>삭제</button>}
      </div>
    </div>
  );
};
