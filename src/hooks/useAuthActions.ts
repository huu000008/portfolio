import { useAuth } from '@/contexts/AuthContext';

export function useAuthActions() {
  const { signOut } = useAuth();

  const logout = async () => {
    await signOut();
  };

  // 추후: login, signup 등 추가 가능

  return { logout };
}
