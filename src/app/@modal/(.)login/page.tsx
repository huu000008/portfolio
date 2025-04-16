'use client';

import AuthModal from '@/components/auth/AuthModal';

export default function LoginModalPage() {
  return <AuthModal open={true} initialMode="login" />;
}
