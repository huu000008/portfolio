import { isServer } from '@/lib/utils/isServer';
import { Project } from '@/types/project';
export const getProjectById = async (id: string): Promise<Project | null> => {
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

    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();

    if (error || !data) return null;
    return data;
  }

  const res = await fetch(`/api/projects/${id}`);
  if (!res.ok) throw new Error('프로젝트 조회 실패');
  return res.json();
};
