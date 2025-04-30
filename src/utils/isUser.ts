import { User } from '@/types/user';

export function isUser(obj: unknown): obj is User {
  return (
    !!obj &&
    typeof obj === 'object' &&
    'id' in obj &&
    typeof (obj as { id?: unknown }).id === 'string' &&
    'email' in obj &&
    typeof (obj as { email?: unknown }).email === 'string' &&
    'app_metadata' in obj &&
    'user_metadata' in obj &&
    'aud' in obj &&
    typeof (obj as { aud?: unknown }).aud === 'string' &&
    'created_at' in obj &&
    typeof (obj as { created_at?: unknown }).created_at === 'string'
  );
}
