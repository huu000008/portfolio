'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { CheckboxButtonGroup } from '@/components/ui/CheckboxButtonGroup/CheckboxButtonGroup';
import { useCreateProject, useUpdateProject } from '@/hooks/useProjects';
import { ImageUploader } from '@/components/ui/ImageUploader/ImageUploader';
import { parseISO, isValid, format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { extractErrorMessage } from '@/utils/common';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// 스키마 및 타입 정의 부분은 동일하게 유지됩니다.
const requiredText = (message: string) => z.string({ required_error: message }).min(1, { message });

const projectPeriodSchema = z.object({
  from: z.date({ required_error: '시작일을 선택해주세요.' }),
  to: z.date({ required_error: '종료일을 선택해주세요.' }),
});

const projectFormSchema = z.object({
  title: requiredText('제목을 입력해주세요.'),
  description: requiredText('설명을 입력해주세요.'),
  projectPeriod: projectPeriodSchema,
  team: requiredText('팀 구성을 입력해주세요.'),
  roles: requiredText('맡은 역할을 입력해주세요.'),
  techStack: z.array(z.string()),
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
  'Vue.js',
  'Vuetify',
  'Vuex',
  'jQuery',
];

interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormValues & { id: string }>;
  isEditMode?: boolean;
}

export const ProjectForm = ({ defaultValues, isEditMode = false }: ProjectFormProps) => {
  const parsePeriod = (raw?: string) => {
    if (!raw || typeof raw !== 'string' || !raw.includes('~'))
      return { from: undefined, to: undefined };
    const [fromStr, toStr] = raw.split('~').map(s => s.trim());
    const from = parseISO(fromStr);
    const to = parseISO(toStr);
    return {
      from: isValid(from) ? from : undefined,
      to: isValid(to) ? to : undefined,
    };
  };

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      projectPeriod: parsePeriod(String(defaultValues?.projectPeriod ?? '')),
      team: defaultValues?.team || '',
      roles: defaultValues?.roles || '',
      techStack: Array.isArray(defaultValues?.techStack)
        ? defaultValues?.techStack
        : defaultValues?.techStack === undefined
          ? []
          : undefined,
      contributions: defaultValues?.contributions || '',
      achievements: defaultValues?.achievements || '',
      retrospective: defaultValues?.retrospective || '',
      thumbnailUrl: defaultValues?.thumbnailUrl || undefined,
    },
  });

  const { handleSubmit, reset, control } = form;

  const router = useRouter();

  // 새로운 커스텀 훅 사용
  const { mutate: createProject } = useCreateProject();
  const { mutate: updateProject } = useUpdateProject();

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    reset({
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      projectPeriod: parsePeriod(String(defaultValues?.projectPeriod ?? '')),
      team: defaultValues?.team || '',
      roles: defaultValues?.roles || '',
      techStack: Array.isArray(defaultValues?.techStack)
        ? defaultValues.techStack
        : defaultValues?.techStack === undefined
          ? []
          : undefined,
      contributions: defaultValues?.contributions || '',
      achievements: defaultValues?.achievements || '',
      retrospective: defaultValues?.retrospective || '',
      thumbnailUrl: defaultValues?.thumbnailUrl || undefined,
    });
  }, [defaultValues, reset]);

  // 에러 발생 시 포커스 이동 로직
  const handleFormError = (formErrors: Record<string, unknown>) => {
    const errorFields = Object.keys(formErrors);
    if (errorFields.length > 0) {
      const firstErrorField = errorFields[0] as keyof ProjectFormValues;
      let elementToFocus: HTMLElement | null = null;
      console.log(`Focus attempt for error field: ${firstErrorField}`);

      // 1. Specific lookup for CheckboxGroup first (using name)
      if (firstErrorField === 'techStack') {
        elementToFocus = document.querySelector<HTMLElement>(
          `input[name="${firstErrorField}"][type="checkbox"]`,
        );
        console.log('TechStack Checkbox focus target:', elementToFocus);
      }
      // 2. Standard ID lookup for all other fields (including DatePicker button)
      else {
        elementToFocus = document.getElementById(firstErrorField);
        console.log('Element found by ID:', elementToFocus);
      }

      // 3. Fallback to label if no element found by specific logic or ID
      if (!elementToFocus) {
        elementToFocus = document.querySelector(`label[for="${firstErrorField}"]`);
        console.log('Fallback label focus target:', elementToFocus);
      }

      // 4. Focus and scroll with delay
      if (elementToFocus) {
        console.log('Attempting focus on:', elementToFocus);
        setTimeout(() => {
          elementToFocus.focus({ preventScroll: true });
          elementToFocus.scrollIntoView({ behavior: 'smooth', block: 'center' });
          console.log('Focus executed after delay for:', firstErrorField);
        }, 50);
      } else {
        console.warn('Could not find ANY element or label to focus for field:', firstErrorField);
      }
    }
    // 에러 발생 시 isSubmitting 상태를 false로 설정
    setIsSubmitting(false);
  };

  // 폼 제출 성공 시 로직
  const onSubmit = (data: ProjectFormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const { from, to } = data.projectPeriod;
    const periodStr =
      from && to ? `${format(from, 'yyyy-MM-dd')} ~ ${format(to, 'yyyy-MM-dd')}` : '';
    const submitData = {
      title: data.title,
      description: data.description,
      projectPeriod: periodStr,
      team: data.team,
      roles: data.roles,
      techStack: data.techStack,
      contributions: data.contributions,
      achievements: data.achievements,
      retrospective: data.retrospective,
      thumbnailUrl: data.thumbnailUrl,
    };
    if (isEditMode && defaultValues?.id) {
      updateProject(
        { id: defaultValues.id, ...submitData },
        {
          onSuccess: result => {
            if (result.data) {
              router.push('/projects');
            } else if (result.error) {
              console.error(result.error.message);
            }
          },
          onError: err => {
            console.error(extractErrorMessage(err, '예기치 않은 오류가 발생했습니다.'));
          },
        },
      );
    } else {
      createProject(submitData, {
        onSuccess: result => {
          if (result.data) {
            router.push('/projects');
          } else if (result.error) {
            console.error(result.error.message);
          }
        },
        onError: err => {
          console.error(extractErrorMessage(err, '예기치 않은 오류가 발생했습니다.'));
        },
      });
    }
  };

  const buttonLabel = isEditMode ? '수정하기' : '제출하기';

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit, handleFormError)}
        className="container mx-auto flex flex-col gap-8 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-16"
        aria-label="프로젝트 정보 입력 폼"
        inert={isSubmitting}
      >
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>제목</FormLabel>
              <FormControl>
                <Input type="text" placeholder="제목" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>설명</FormLabel>
              <FormControl>
                <Textarea placeholder="설명" className="min-h-[25rem]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="thumbnailUrl"
          render={() => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>썸네일 이미지</FormLabel>
              <FormControl>
                <ImageUploader name="thumbnailUrl" id="thumbnailUrl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="projectPeriod"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>프로젝트 기간</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-[300px] justify-start text-left font-normal',
                        !field.value?.from && 'text-muted-foreground',
                        'border-none',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value?.from && field.value?.to ? (
                        `${format(field.value.from, 'yyyy.MM.dd')} ~ ${format(field.value.to, 'yyyy.MM.dd')}`
                      ) : (
                        <span>날짜 구간 선택</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="range"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="team"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>팀 구성</FormLabel>
              <FormControl>
                <Input type="text" placeholder="팀 구성" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="roles"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>맡은 역할</FormLabel>
              <FormControl>
                <Input type="text" placeholder="맡은 역할" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="techStack"
          render={() => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>기술 스택</FormLabel>
              <FormControl>
                <CheckboxButtonGroup name="techStack" options={TECH_STACK_OPTIONS} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="contributions"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>주요 기여 내용</FormLabel>
              <FormControl>
                <Textarea placeholder="주요 기여 내용" className="min-h-[25rem]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="achievements"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>프로젝트 성과</FormLabel>
              <FormControl>
                <Textarea placeholder="프로젝트 성과" className="min-h-[25rem]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="retrospective"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>회고</FormLabel>
              <FormControl>
                <Textarea placeholder="회고" className="min-h-[25rem]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="sticky bottom-8 bg-[var(--color-neutral-500)] font-semibold shadow-lg hover:bg-[var(--color-neutral-400)]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (isEditMode ? '수정 중...' : '제출 중...') : buttonLabel}
        </Button>
      </form>
    </Form>
  );
};
