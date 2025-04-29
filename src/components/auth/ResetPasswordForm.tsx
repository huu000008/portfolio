import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const schema = z.object({
  email: z.string().email('이메일을 올바르게 입력하세요.'),
});

interface ResetPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  loading?: boolean;
}

export default function ResetPasswordForm({ onSubmit, loading }: ResetPasswordFormProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  async function handleSubmit(values: { email: string }) {
    await onSubmit(values.email);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input type="email" placeholder="이메일" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          비밀번호 재설정 메일 보내기
        </Button>
      </form>
    </Form>
  );
}
