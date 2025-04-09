'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { DatePicker } from '@/components/ui/DatePicker/DatePicker';
import { CheckboxButtonGroup } from '@/components/ui/CheckboxButtonGroup/CheckboxButtonGroup';
import { useCreateProject, useUpdateProject } from '@/hooks/useProjects';
import styles from './ProjectForm.module.scss';
import { useToast } from '@/hooks/useToast';
import { ImageUploader } from '@/components/ui/ImageUploader/ImageUploader';

import { parseISO, isValid } from 'date-fns';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button/Button';

// 스키마 및 타입 정의 부분은 동일하게 유지됩니다.
const requiredText = (message: string) => z.string({ required_error: message }).min(1, { message });

const projectFormSchema = z.object({
  title: requiredText('제목을 입력해주세요.'),
  description: requiredText('설명을 입력해주세요.'),
  projectPeriod: z.string().min(1, { message: '프로젝트 기간을 선택해주세요.' }),
  team: requiredText('팀 구성을 입력해주세요.'),
  roles: requiredText('맡은 역할을 입력해주세요.'),
  techStack: z.array(z.string()).min(1, { message: '기술 스택을 1개 이상 선택해주세요.' }),
  contributions: requiredText('주요 기여 내용을 입력해주세요.'),
  achievements: requiredText('프로젝트 성과를 입력해주세요.'),
  retrospective: requiredText('회고를 입력해주세요.'),
  thumbnailUrl: z.string().optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

const TECH_STACK_OPTIONS = [
  'React',
  'Next.js',
  'TypeScript',
  'Tailwind CSS',
  'Supabase',
  'Zustand',
  'React Query',
];

interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormValues & { id: string }>;
  isEditMode?: boolean;
}

export const ProjectForm = ({ defaultValues, isEditMode = false }: ProjectFormProps) => {
  const formattedPeriod = (() => {
    let period = '';
    const raw = defaultValues?.projectPeriod;

    if (typeof raw === 'string' && raw.includes('~')) {
      const [fromStr, toStr] = raw.split('~').map(s => s.trim());
      const from = parseISO(fromStr);
      const to = parseISO(toStr);
      if (isValid(from) && isValid(to)) {
        period = `${from.toISOString()} ~ ${to.toISOString()}`;
      }
    }
    return period || '';
  })();
  const methods = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      // ✅ 초기값 객체 생성
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      projectPeriod: formattedPeriod,
      team: defaultValues?.team || '',
      roles: defaultValues?.roles || '',
      techStack: Array.isArray(defaultValues?.techStack)
        ? defaultValues?.techStack
        : defaultValues?.techStack === undefined
          ? [] // Zod 스키마에 따라 최소 1개 요구
          : undefined,
      contributions: defaultValues?.contributions || '',
      achievements: defaultValues?.achievements || '',
      retrospective: defaultValues?.retrospective || '',
      thumbnailUrl: defaultValues?.thumbnailUrl || undefined,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const router = useRouter();
  const { success, error: showError } = useToast();

  // 새로운 커스텀 훅 사용
  const { mutate: createProject } = useCreateProject();
  const { mutate: updateProject } = useUpdateProject();

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    reset({
      ...defaultValues, // undefined일 경우 빈 객체로 대체
      projectPeriod: formattedPeriod,
      techStack: Array.isArray(defaultValues?.techStack)
        ? defaultValues.techStack
        : defaultValues?.techStack === undefined
          ? []
          : undefined,
    });
  }, [defaultValues, formattedPeriod, reset]);

  const onSubmit = (data: ProjectFormValues) => {
    if (isSubmitting) return; // 이미 제출 중이면 더 이상 진행하지 않음
    setIsSubmitting(true);
    if (isEditMode && defaultValues?.id) {
      // 수정 모드일 때
      updateProject(
        { id: defaultValues.id, ...data },
        {
          onSuccess: result => {
            if (result.data) {
              success(`프로젝트가 성공적으로 수정되었습니다.`, {
                title: '저장 완료',
                duration: 3000,
              });
              router.push('/projects');
            } else if (result.error) {
              showError(result.error.message, {
                title: '저장 실패',
                duration: 5000,
              });
            }
          },
          onError: err => {
            const errorMessage =
              err instanceof Error ? err.message : '예기치 않은 오류가 발생했습니다.';
            showError(errorMessage, {
              title: '오류',
              duration: 5000,
            });
          },
        },
      );
    } else {
      // 생성 모드일 때
      createProject(data, {
        onSuccess: result => {
          if (result.data) {
            success(`프로젝트가 성공적으로 생성되었습니다.`, {
              title: '저장 완료',
              duration: 3000,
            });
            router.push('/projects');
          } else if (result.error) {
            showError(result.error.message, {
              title: '저장 실패',
              duration: 5000,
            });
          }
        },
        onError: err => {
          const errorMessage =
            err instanceof Error ? err.message : '예기치 않은 오류가 발생했습니다.';
          showError(errorMessage, {
            title: '오류',
            duration: 5000,
          });
        },
      });
    }
  };

  const buttonLabel = isEditMode ? '수정하기' : '제출하기';

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.wrap}
        aria-label="프로젝트 정보 입력 폼"
      >
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            제목
          </label>
          <input
            type="text"
            id="title"
            {...register('title')}
            className={styles.input}
            aria-invalid={errors.title ? 'true' : 'false'}
          />
          {errors.title && (
            <p className={styles.error} role="alert">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            설명
          </label>
          <textarea
            id="description"
            {...register('description')}
            className={styles.textarea}
            aria-invalid={errors.description ? 'true' : 'false'}
          />
          {errors.description && (
            <p className={styles.error} role="alert">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="thumbnailUrl" className={styles.label}>
            썸네일 이미지
          </label>
          <ImageUploader name="thumbnailUrl" id="thumbnailUrl" />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="projectPeriod" className={styles.label}>
            프로젝트 기간
          </label>
          <DatePicker name="projectPeriod" id="projectPeriod" />
          {errors.projectPeriod && (
            <p className={styles.error} role="alert">
              {errors.projectPeriod.message}
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="team" className={styles.label}>
            팀 구성
          </label>
          <textarea
            id="team"
            {...register('team')}
            className={styles.textarea}
            aria-invalid={errors.team ? 'true' : 'false'}
          />
          {errors.team && (
            <p className={styles.error} role="alert">
              {errors.team.message}
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="roles" className={styles.label}>
            맡은 역할
          </label>
          <textarea
            id="roles"
            {...register('roles')}
            className={styles.textarea}
            aria-invalid={errors.roles ? 'true' : 'false'}
          />
          {errors.roles && (
            <p className={styles.error} role="alert">
              {errors.roles.message}
            </p>
          )}
        </div>

        <fieldset className={styles.formGroup}>
          <legend className={styles.label}>🛠️ 사용 기술 스택</legend>
          <CheckboxButtonGroup name="techStack" options={TECH_STACK_OPTIONS} />
          {errors.techStack && (
            <p className={styles.error} role="alert">
              {errors.techStack.message}
            </p>
          )}
        </fieldset>

        <div className={styles.formGroup}>
          <label htmlFor="contributions" className={styles.label}>
            주요 기여
          </label>
          <textarea
            id="contributions"
            {...register('contributions')}
            className={styles.textarea}
            aria-invalid={errors.contributions ? 'true' : 'false'}
          />
          {errors.contributions && (
            <p className={styles.error} role="alert">
              {errors.contributions.message}
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="achievements" className={styles.label}>
            프로젝트 성과
          </label>
          <textarea
            id="achievements"
            {...register('achievements')}
            className={styles.textarea}
            aria-invalid={errors.achievements ? 'true' : 'false'}
          />
          {errors.achievements && (
            <p className={styles.error} role="alert">
              {errors.achievements.message}
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="retrospective" className={styles.label}>
            회고 & 느낀 점
          </label>
          <textarea
            id="retrospective"
            {...register('retrospective')}
            className={styles.textarea}
            aria-invalid={errors.retrospective ? 'true' : 'false'}
          />
          {errors.retrospective && (
            <p className={styles.error} role="alert">
              {errors.retrospective.message}
            </p>
          )}
        </div>

        <Button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? (isEditMode ? '수정 중...' : '제출 중...') : buttonLabel}
        </Button>
      </form>
    </FormProvider>
  );
};
