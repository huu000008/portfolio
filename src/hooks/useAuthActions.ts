import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export function useAuthActions() {
  const router = useRouter();
  const { signOut } = useAuth();

  const logout = async () => {
    await signOut();
    toast.success('정상적으로 로그아웃되었습니다.', {
      action: {
        label: '홈으로',
        onClick: () => router.push('/'),
      },
    });
  };

  // 추후: login, signup 등 추가 가능

  return { logout };
}
