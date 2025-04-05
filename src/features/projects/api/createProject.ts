'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ProjectFormValues } from '@/features/projects/components/ProjectForm';

export async function createProject(data: ProjectFormValues) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: name => cookieStore.get(name)?.value ?? '',
      },
    },
  );

  const { error } = await supabase.from('projects').insert({
    title: data.title,
    description: data.description,
    project_period: data.projectPeriod,
    team: data.team,
    roles: data.roles,
    tech_stack: data.techStack,
    contributions: data.contributions,
    achievements: data.achievements,
    retrospective: data.retrospective,
  });

  return { error };
}
