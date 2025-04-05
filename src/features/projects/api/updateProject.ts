import { isServer } from '@/lib/utils/isServer';
import { ProjectFormValues } from '@/features/projects/components/ProjectForm';

interface UpdateProjectPayload extends ProjectFormValues {
  id: string;
}

export const updateProject = async ({ id, ...data }: UpdateProjectPayload) => {
  if (isServer()) {
    const { cookies } = await import('next/headers');
    const { createServerClient } = await import('@supabase/ssr');

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: name => cookieStore.get(name)?.value ?? null,
          set: () => {},
          remove: () => {},
        },
      },
    );

    const { error } = await supabase.from('projects').update(data).eq('id', id);

    if (error) throw error;
    return;
  }

  const res = await fetch('/api/projects/update', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error.message || '프로젝트 수정 실패');
  }
};
