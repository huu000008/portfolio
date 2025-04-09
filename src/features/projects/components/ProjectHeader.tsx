// components/ProjectHeader.tsx
'use client';

import { TransitionLink } from '@/components/ui/TransitionLink/TransitionLink';
import styles from './ProjectHeader.module.scss';
import { useRouter, usePathname } from 'next/navigation';
import { useDeleteProject } from '@/hooks/useProjects';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/ui/Button/Button';
import classNames from 'classnames';

interface ProjectHeaderProps {
  id?: string;
}

export const ProjectHeader = ({ id }: ProjectHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { success, error: showError } = useToast();
  const { mutate: deleteProject, isPending } = useDeleteProject();

  const isEditPage = pathname.startsWith('/projects/edit');
  const isListPage = pathname === '/projects';
  const isDetailPage = pathname.startsWith('/projects/') && !isEditPage;

  const handleDelete = () => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;

    if (!id) {
      showError('프로젝트 ID가 없습니다', {
        title: '오류',
        duration: 5000,
      });
      return;
    }

    deleteProject(id, {
      onSuccess: () => {
        success('프로젝트가 성공적으로 삭제되었습니다', {
          title: '삭제 완료',
          duration: 3000,
        });
        router.push('/projects');
      },
      onError: err => {
        showError(
          '삭제 실패: ' + (err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다'),
          {
            title: '오류',
            duration: 5000,
          },
        );
      },
    });
  };

  return (
    <div className={styles.wrap}>
      <h2>Projects</h2>
      <div className={styles.actions}>
        {!isListPage && (
          <TransitionLink href="/projects" isButton>
            목록
          </TransitionLink>
        )}

        {isListPage && (
          <TransitionLink href="/projects/write" isButton>
            작성
          </TransitionLink>
        )}

        {isDetailPage && id && (
          <>
            <TransitionLink href={`/projects/edit/${id}`} isButton>
              수정
            </TransitionLink>
            <Button
              onClick={handleDelete}
              disabled={isPending}
              className={isPending ? styles.loading : ''}
            >
              {isPending ? '삭제 중...' : '삭제'}
            </Button>
          </>
        )}

        {isEditPage && id && (
          <Button
            onClick={handleDelete}
            disabled={isPending}
            className={isPending ? styles.loading : ''}
          >
            {isPending ? '삭제 중...' : '삭제'}
          </Button>
        )}
      </div>
    </div>
  );
};
