import SignupForm from '@/components/auth/SignupForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '회원가입 | 포트폴리오 프로젝트',
  description: '새 계정을 만들어 프로젝트를 관리하세요.',
};

export default function SignupPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>
        <SignupForm />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <a href="/auth/login" className="text-blue-600 hover:underline">
              로그인
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
