import { useState } from 'react';
import { z } from 'zod';
import { extractErrorMessage } from '@/utils/common';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (email: string, password: string) => Promise<void>;
  loading?: boolean;
  error?: string;
}

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function AuthForm({ mode, onSubmit, loading, error }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const result = schema.safeParse({ email, password });
    if (!result.success) {
      setFormError('이메일과 비밀번호를 올바르게 입력하세요.');
      return;
    }
    try {
      await onSubmit(email, password);
    } catch (err: unknown) {
      setFormError(extractErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="input"
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="input"
      />
      {formError && <div className="text-red-500 text-sm">{formError}</div>}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" className="btn-primary" disabled={loading}>
        {mode === 'login' ? '로그인' : '회원가입'}
      </button>
    </form>
  );
}
