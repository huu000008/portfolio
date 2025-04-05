import { isServer } from '@/lib/utils/isServer';

export const deleteProject = async (id: string) => {
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

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    return;
  }

  // 클라이언트 fetch
  const res = await fetch('/api/projects/delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error.message || '프로젝트 삭제 실패');
  }
};
