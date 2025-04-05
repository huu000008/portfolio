'use client';

import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { DatePicker } from '@/components/ui/DatePicker/DatePicker';
import { CheckboxButtonGroup } from '@/components/ui/CheckboxButtonGroup/CheckboxButtonGroup';
import { createProject } from '@/features/projects/api/createProject';
import { updateProject } from '@/features/projects/api/updateProject';

import styles from './ProjectForm.module.scss';

const requiredText = (message: string) => z.string({ required_error: message }).min(1, { message });

const projectFormSchema = z.object({
  title: requiredText('제목을 입력해주세요.'),
  description: requiredText('설명을 입력해주세요.'),
  projectPeriod: requiredText('프로젝트 기간을 선택해주세요.'),
  team: requiredText('팀 구성을 입력해주세요.'),
  roles: requiredText('맡은 역할을 입력해주세요.'),
  techStack: z
    .array(z.string(), {
      required_error: '기술 스택을 1개 이상 선택해주세요.',
      invalid_type_error: '기술 스택을 1개 이상 선택해주세요.',
    })
    .min(1, { message: '기술 스택을 1개 이상 선택해주세요.' }),
  contributions: requiredText('주요 기여 내용을 입력해주세요.'),
  achievements: requiredText('프로젝트 성과를 입력해주세요.'),
  retrospective: requiredText('회고를 입력해주세요.'),
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
    defaultValues: {
      ...defaultValues,
      techStack: Array.isArray(defaultValues?.techStack) ? defaultValues.techStack : [],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;
  const router = useRouter();

  useEffect(() => {
    reset({
      ...defaultValues,
      techStack: Array.isArray(defaultValues?.techStack) ? defaultValues.techStack : [],
    });
  }, [defaultValues, reset]);

  const onSubmit = async (data: ProjectFormValues) => {
    const res =
      isEditMode && defaultValues?.id
        ? await updateProject({ id: defaultValues.id, ...data })
        : await createProject(data);

    if (res?.error) {
      alert('저장 실패: ' + res.error.message);
      return;
    }

    router.push('/projects');
  };

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
          <textarea {...register('description')} />
          {errors.description && <p className={styles.error}>{errors.description.message}</p>}
        </label>

        <label htmlFor="projectPeriod">
          프로젝트 기간
          <DatePicker name="projectPeriod" id="projectPeriod" />
          {errors.projectPeriod && <p className={styles.error}>{errors.projectPeriod.message}</p>}
        </label>

        <label>
          팀 구성
          <textarea {...register('team')} />
          {errors.team && <p className={styles.error}>{errors.team.message}</p>}
        </label>

        <label>
          맡은 역할
          <textarea {...register('roles')} />
          {errors.roles && <p className={styles.error}>{errors.roles.message}</p>}
        </label>

        <fieldset>
          <legend>🛠️ 사용 기술 스택</legend>
          <CheckboxButtonGroup name="techStack" options={TECH_STACK_OPTIONS} />
          {errors.techStack && <p className={styles.error}>{errors.techStack.message}</p>}
        </fieldset>

        <label>
          주요 기여
          <textarea {...register('contributions')} />
          {errors.contributions && <p className={styles.error}>{errors.contributions.message}</p>}
        </label>

        <label>
          프로젝트 성과
          <textarea {...register('achievements')} />
          {errors.achievements && <p className={styles.error}>{errors.achievements.message}</p>}
        </label>

        <label>
          회고 & 느낀 점
          <textarea {...register('retrospective')} />
          {errors.retrospective && <p className={styles.error}>{errors.retrospective.message}</p>}
        </label>

        <button type="submit">{isEditMode ? '수정하기' : '제출하기'}</button>
      </form>
    </FormProvider>
  );
};
