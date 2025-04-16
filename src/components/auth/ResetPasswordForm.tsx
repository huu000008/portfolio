import { useState } from 'react';
import { z } from 'zod';

interface ResetPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  loading?: boolean;
  error?: string;
}

const schema = z.object({
  email: z.string().email(),
});

export default function ResetPasswordForm({ onSubmit, loading, error }: ResetPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const result = schema.safeParse({ email });
    if (!result.success) {
      setFormError('이메일을 올바르게 입력하세요.');
      return;
    }
    try {
      await onSubmit(email);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else if (typeof err === 'string') {
        setFormError(err);
      } else {
        setFormError('알 수 없는 오류가 발생했습니다.');
      }
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
      {formError && <div className="text-red-500 text-sm">{formError}</div>}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" className="btn-primary" disabled={loading}>
        비밀번호 재설정 메일 보내기
      </button>
    </form>
  );
}
