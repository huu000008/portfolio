// components/ProjectHeader.tsx
'use client';

import styles from './ProjectHeader.module.scss';
import { useRouter, usePathname } from 'next/navigation';
import { useDeleteProject } from '@/hooks/useProjects';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { extractErrorMessage } from '@/utils/common';
import Link from 'next/link';

interface ProjectHeaderProps {
  id?: string;
  userId?: string;
  className?: string;
  title?: string;
}

export const ProjectHeader = ({ id, userId, className, title }: ProjectHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
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
      toast.error('프로젝트 ID가 없습니다', {
        description: '오류',
        duration: 5000,
      });
      return;
    }

    deleteProject(id, {
      onSuccess: () => {
        toast.success('프로젝트가 성공적으로 삭제되었습니다', {
          description: '삭제 완료',
          duration: 3000,
        });
        router.push('/projects');
      },
      onError: err => {
        toast.error('삭제 실패: ' + extractErrorMessage(err, '알 수 없는 오류가 발생했습니다'), {
          description: '오류',
          duration: 5000,
        });
      },
    });
  };

  return (
    <div className={cn(styles.wrap, className)}>
      <h2 className={styles.title}>{title ? title : 'Projects'}</h2>
      <div className={styles.actions}>
        {!isListPage && (
          <Link href="/projects" aria-label="프로젝트 목록 보기" className={styles.button}>
            목록
          </Link>
        )}

        {isListPage && user && (
          <Button asChild>
            <Link href="/projects/write" aria-label="프로젝트 작성 하기" className={styles.button}>
              작성
            </Link>
          </Button>
        )}

        {/* 작성자 또는 관리자인 경우 수정/삭제 버튼 표시 */}
        {isDetailPage && id && user && hasEditPermission && (
          <>
            <Button asChild>
              <Link
                href={{ pathname: `/projects/edit/${id}` }}
                aria-label="프로젝트 수정 하기"
                className={styles.button}
              >
                수정
              </Link>
            </Button>
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
