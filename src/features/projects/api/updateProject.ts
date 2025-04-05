import { isServer } from '@/lib/utils/isServer';

interface UpdateProjectPayload {
  id: string;
  title: string;
  content: string;
}

export const updateProject = async ({ id, title, content }: UpdateProjectPayload) => {
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

    const { error } = await supabase.from('projects').update({ title, content }).eq('id', id);

    if (error) throw error;
    return;
  }

  const res = await fetch('/api/projects/update', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, title, content }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error.message || '프로젝트 수정 실패');
  }
};
