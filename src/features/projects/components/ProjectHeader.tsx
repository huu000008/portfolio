'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useDeleteProject } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import styles from './ProjectHeader.module.scss';

interface ProjectHeaderProps {
  id?: string;
  userId?: string;
  title?: string;
}

function ActionButton({
  asLink,
  href,
  onClick,
  isPending,
  children,
  color,
  ariaLabel,
  disabled,
  className = '',
}: {
  asLink?: boolean;
  href?: string | { pathname: string };
  onClick?: () => void;
  isPending?: boolean;
  children: React.ReactNode;
  color?: 'secondary' | 'destructive';
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Button
      asChild={!!asLink}
      onClick={onClick}
      variant={color}
      disabled={isPending || disabled}
      className={[styles.actionButton, isPending ? styles.pending : '', className].join(' ')}
    >
      {asLink && href ? (
        <Link href={href} aria-label={ariaLabel}>
          {isPending ? <Loader2 className={styles.loader} /> : null}
          {children}
        </Link>
      ) : (
        <>
          {isPending ? <Loader2 className={styles.loader} /> : null}
          {children}
        </>
      )}
    </Button>
  );
}

export const ProjectHeader = ({ id, userId, title }: ProjectHeaderProps) => {
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
    if (!id) return;
    deleteProject(id, {
      onSuccess: () => {
        router.push('/projects');
      },
      onError: () => {},
    });
  };

  return (
    <div className={styles.header}>
      <h2 className={styles.title}>{title ? title : 'Projects'}</h2>
      <div className={styles.actions}>
        {!isListPage && (
          <ActionButton asLink href="/projects" ariaLabel="프로젝트 목록 보기">
            목록
          </ActionButton>
        )}

        {isListPage && user && (
          <ActionButton
            asLink
            href="/projects/write"
            ariaLabel="프로젝트 작성 하기"
            isPending={isPending}
          >
            작성
          </ActionButton>
        )}

        {isDetailPage && id && user && hasEditPermission && (
          <>
            <ActionButton
              asLink
              href={{ pathname: `/projects/edit/${id}` }}
              ariaLabel="프로젝트 수정 하기"
              color="secondary"
              isPending={isPending}
            >
              {isPending ? '수정 중...' : '수정'}
            </ActionButton>
            <ActionButton onClick={handleDelete} color="destructive" isPending={isPending}>
              {isPending ? '삭제 중...' : '삭제'}
            </ActionButton>
          </>
        )}

        {isEditPage && id && user && hasEditPermission && (
          <ActionButton onClick={handleDelete} color="destructive" isPending={isPending}>
            {isPending ? '삭제 중...' : '삭제'}
          </ActionButton>
        )}
      </div>
    </div>
  );
};
