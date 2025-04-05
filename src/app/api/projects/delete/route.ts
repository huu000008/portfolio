import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 프로젝트 삭제 API 라우트
 *
 * 프로젝트 삭제 요청을 처리합니다.
 *
 * @param req NextRequest
 * @returns NextResponse
 */
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
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

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}
