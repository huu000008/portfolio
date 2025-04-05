'use client';

import { TransitionLink } from '@/components/TransitionLink';
import styles from './ProjectHeader.module.scss';
import { useRouter, usePathname } from 'next/navigation';
import { deleteProject } from '@/features/projects/api/deleteProject';

interface ProjectHeaderProps {
  id?: string;
}

export const ProjectHeader = ({ id }: ProjectHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const isEditPage = pathname.startsWith('/projects/edit');
  const isListPage = pathname === '/projects';
  const isDetailPage = pathname.startsWith('/projects/') && !isEditPage;

  const handleDelete = async () => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;

    if (!id) {
      alert('프로젝트 ID가 없습니다');
      return;
    }

    try {
      await deleteProject(id);
      router.push('/projects');
    } catch (error) {
      alert(
        '삭제 실패: ' + (error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다'),
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
