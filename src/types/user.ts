export interface User {
  id: string;
  email: string;
  // 필요한 경우 아래 필드를 확장하세요
  app_metadata: Record<string, unknown>;
  user_metadata: Record<string, unknown>;
  aud: string;
  created_at: string;
}
