import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  const {
    id,
    title,
    description,
    projectPeriod,
    team,
    roles,
    techStack,
    contributions,
    achievements,
    retrospective,
  } = await req.json();

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

  const { error } = await supabase
    .from('projects')
    .update({
      title,
      description,
      project_period: projectPeriod,
      team,
      roles,
      tech_stack: techStack,
      contributions,
      achievements,
      retrospective,
    })
    .eq('id', id);

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}
