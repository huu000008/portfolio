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
import { useProjectStore } from '@/stores/projectStore';
import { parseISO, isValid } from 'date-fns';
import { useEffect } from 'react';

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

      const { fetchProjects } = useProjectStore.getState();
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
      <form onSubmit={handleSubmit(onSubmit)} className={styles.wrap}>
        <label>
          제목
          <input type="text" {...register('title')} />
          {errors.title && <p className={styles.error}>{errors.title.message}</p>}
        </label>

        <label>
          설명
          <textarea {...register('description')} style={{ whiteSpace: 'pre-wrap' }} />
          {errors.description && <p className={styles.error}>{errors.description.message}</p>}
        </label>

        <label>
          썸네일 이미지
          <ImageUploader name="thumbnailUrl" />
        </label>

        <label htmlFor="projectPeriod">
          프로젝트 기간
          <DatePicker name="projectPeriod" id="projectPeriod" />
          {errors.projectPeriod && <p className={styles.error}>{errors.projectPeriod.message}</p>}
        </label>

        <label>
          팀 구성
          <textarea {...register('team')} style={{ whiteSpace: 'pre-wrap' }} />
          {errors.team && <p className={styles.error}>{errors.team.message}</p>}
        </label>

        <label>
          맡은 역할
          <textarea {...register('roles')} style={{ whiteSpace: 'pre-wrap' }} />
          {errors.roles && <p className={styles.error}>{errors.roles.message}</p>}
        </label>

        <fieldset>
          <legend>🛠️ 사용 기술 스택</legend>
          <CheckboxButtonGroup name="techStack" options={TECH_STACK_OPTIONS} />
          {errors.techStack && <p className={styles.error}>{errors.techStack.message}</p>}
        </fieldset>

        <label>
          주요 기여
          <textarea {...register('contributions')} style={{ whiteSpace: 'pre-wrap' }} />
          {errors.contributions && <p className={styles.error}>{errors.contributions.message}</p>}
        </label>

        <label>
          프로젝트 성과
          <textarea {...register('achievements')} style={{ whiteSpace: 'pre-wrap' }} />
          {errors.achievements && <p className={styles.error}>{errors.achievements.message}</p>}
        </label>

        <label>
          회고 & 느낀 점
          <textarea {...register('retrospective')} style={{ whiteSpace: 'pre-wrap' }} />
          {errors.retrospective && <p className={styles.error}>{errors.retrospective.message}</p>}
        </label>

        <button type="submit">{buttonLabel}</button>
      </form>
    </FormProvider>
  );
};
