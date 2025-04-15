// components/ProjectHeader.tsx
'use client';

import { TransitionLink } from '@/components/ui/TransitionLink/TransitionLink';
import styles from './ProjectHeader.module.scss';
import { useRouter, usePathname } from 'next/navigation';
import { useDeleteProject } from '@/hooks/useProjects';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/ui/Button/Button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface ProjectHeaderProps {
  id?: string;
  userId?: string;
  className?: string;
  title?: string;
}

export const ProjectHeader = ({ id, userId, className, title }: ProjectHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { success, error: showError } = useToast();
  const { mutate: deleteProject, isPending } = useDeleteProject();
  const { user, isAdmin } = useAuth();

  const isEditPage = pathname.startsWith('/projects/edit');
  const isListPage = pathname === '/projects';
  const isDetailPage = pathname.startsWith('/projects/') && !isEditPage;

  // 현재 사용자가 프로젝트 작성자인지 확인
  const isAuthor = user?.id === userId;

  // 작성자이거나 관리자인 경우 수정/삭제 권한 부여
  const hasEditPermission = isAuthor || isAdmin();

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
    <div className={cn(styles.wrap, className)}>
      <h2 className={styles.title}>{title ? title : 'Projects'}</h2>
      <div className={styles.actions}>
        {!isListPage && (
          <TransitionLink href="/projects" isButton aria-label="프로젝트 목록 보기">
            목록
          </TransitionLink>
        )}

        {isListPage && user && (
          <TransitionLink href="/projects/write" isButton aria-label="프로젝트 작성 하기">
            작성
          </TransitionLink>
        )}

        {/* 작성자 또는 관리자인 경우 수정/삭제 버튼 표시 */}
        {isDetailPage && id && user && hasEditPermission && (
          <>
            <TransitionLink href={`/projects/edit/${id}`} isButton aria-label="프로젝트 수정 하기">
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

        {isEditPage && id && user && hasEditPermission && (
          <>
            <Button
              onClick={handleDelete}
              disabled={isPending}
              className={isPending ? styles.loading : ''}
            >
              {isPending ? '삭제 중...' : '삭제'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
