import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: '프로젝트 ID가 필요합니다.' }, { status: 400 });
    }

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

    if (error) {
      console.error('프로젝트 삭제 중 오류 발생:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('프로젝트 삭제 중 오류 발생:', error);
    return NextResponse.json({ error: '프로젝트 삭제 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
