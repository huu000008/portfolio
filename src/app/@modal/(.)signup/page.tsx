import AuthModal from '@/components/auth/AuthModal';

export default function SignupModalPage() {
  return (
    <AuthModal open={true} initialMode="signup" />
  );
}
