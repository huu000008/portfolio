'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { DatePicker } from '@/components/ui/DatePicker/DatePicker';
import { CheckboxButtonGroup } from '@/components/ui/CheckboxButtonGroup/CheckboxButtonGroup';
import { createProject } from '@/features/projects/api/createProject';
import { updateProject } from '@/features/projects/api/updateProject';
import styles from './ProjectForm.module.scss';
import { useToast } from '@/hooks/useToast';
import { ImageUploader } from '@/components/ui/ImageUploader/ImageUploader';

import { parseISO, isValid } from 'date-fns';
import { useEffect } from 'react';
import { useProjectStore } from '@/stores/projectStore';

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
  const methods = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;
  const router = useRouter();
  const { fetchProjects } = useProjectStore();
  const { success, error } = useToast();

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

  useEffect(() => {
    reset({
      ...defaultValues,
      projectPeriod: formattedPeriod,
      techStack: Array.isArray(defaultValues?.techStack)
        ? defaultValues.techStack
        : defaultValues?.techStack === undefined
          ? []
          : undefined,
    });
  }, [defaultValues, formattedPeriod, reset]);

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      const res =
        isEditMode && defaultValues?.id
          ? await updateProject({ id: defaultValues.id, ...data })
          : await createProject(data);

      if (res?.error) {
        error(res.error.message, {
          title: '저장 실패',
          duration: 5000,
        });
        return;
      }

      success(`프로젝트가 성공적으로 ${isEditMode ? '수정' : '생성'}되었습니다.`, {
        title: '저장 완료',
        duration: 3000,
      });

      await fetchProjects();
      router.push('/projects');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '예기치 않은 오류가 발생했습니다.';
      error(errorMessage, {
        title: '오류',
        duration: 5000,
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

        <button type="submit" className={styles.submitButton}>
          {buttonLabel}
        </button>
      </form>
    </FormProvider>
  );
};
