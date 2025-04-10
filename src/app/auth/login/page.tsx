import LoginForm from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로그인 | 포트폴리오 프로젝트',
  description: '계정에 로그인하여 프로젝트를 관리하세요.',
};

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">로그인</h1>
        <LoginForm />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <a href="/auth/signup" className="text-blue-600 hover:underline">
              회원가입
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
