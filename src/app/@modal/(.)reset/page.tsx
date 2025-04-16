import AuthModal from '@/components/auth/AuthModal';

export default function ResetModalPage() {
  return (
    <AuthModal open={true} initialMode="reset" />
  );
}
