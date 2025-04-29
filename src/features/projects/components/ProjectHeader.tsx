// components/ProjectHeader.tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useDeleteProject } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface ProjectHeaderProps {
  id?: string;
  userId?: string;
  title?: string;
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

    if (!id) {
      return;
    }

    deleteProject(id, {
      onSuccess: () => {
        router.push('/projects');
      },
      onError: () => {},
    });
  };

  return (
    <div
      className={`
        flex items-center justify-between sticky top-8 z-10 w-full max-w-[120rem] mx-auto
        p-8 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-surface)]
        md:w-[calc(100%-100px)] md:ml-[100px] md:mr-[-10px] md:mb-12 md:p-4
        md:rounded-tr-none md:rounded-br-none md:border-r-0
      `}
    >
      <h2
        className={`
          text-[3rem] font-bold
          md:text-lg md:font-medium md:leading-[1.4]
        `}
      >
        {title ? title : 'Projects'}
      </h2>
      <div
        className="
          flex gap-4
          md:flex-col md:absolute md:top-full md:right-0 md:mt-8
          [&>a]:md:rounded-tr-none [&>a]:md:rounded-br-none [&>a]:md:border-r-0
          [&>button]:md:rounded-tr-none [&>button]:md:rounded-br-none [&>button]:md:border-r-0
        "
      >
        {!isListPage && (
          <Link
            href="/projects"
            aria-label="프로젝트 목록 보기"
            className="btn btn-outline px-4 py-2 rounded-md border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-bg-surface)] transition"
          >
            목록
          </Link>
        )}

        {isListPage && user && (
          <Button asChild>
            <Link
              href="/projects/write"
              aria-label="프로젝트 작성 하기"
              className="btn btn-primary px-4 py-2 rounded-md"
            >
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
                className="btn btn-outline px-4 py-2 rounded-md border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-bg-surface)] transition"
              >
                수정
              </Link>
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isPending}
              className={`btn btn-destructive px-4 py-2 rounded-md ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              className={`btn btn-destructive px-4 py-2 rounded-md ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isPending ? '삭제 중...' : '삭제'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
